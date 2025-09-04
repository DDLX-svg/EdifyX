import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchAccounts, registerUser, resendVerificationEmail as resendVerificationEmailService, fetchArticles, updateUserQuizStats, deductPracticeTokens } from '../services/googleSheetService.ts';
import type { Account } from '../types.ts';
import { useToast } from './ToastContext.tsx';

interface LoginResult {
  success: boolean;
  error?: string;
  reason?: 'unverified';
  email?: string;
}

interface AuthContextType {
  currentUser: Account | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    pass: string,
    age: number,
    role: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserStats: (attempted: number, correct: number) => void;
  deductTokensForPractice: () => void;
  newArticleCount: number;
  markArticlesAsSeen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [newArticleCount, setNewArticleCount] = useState(0);
  const { showToast } = useToast();

  const SEEN_ARTICLES_KEY = 'edifyx_seen_articles_v1';

  useEffect(() => {
    // This effect runs when the component mounts and when the user logs in/out.
    // It checks for new articles that the user hasn't seen yet.
    const checkNewArticles = async () => {
      if (!currentUser) {
        setNewArticleCount(0);
        return;
      }
      try {
        const allArticles = await fetchArticles();
        const approvedArticleIds = allArticles.filter(a => a.Status === 'Approved').map(a => a.ID);
        
        const seenArticlesRaw = localStorage.getItem(SEEN_ARTICLES_KEY);
        const seenArticleIds: string[] = seenArticlesRaw ? JSON.parse(seenArticlesRaw) : [];

        const unseenArticles = approvedArticleIds.filter(id => !seenArticleIds.includes(id));
        setNewArticleCount(unseenArticles.length);

      } catch (error) {
        console.error("Failed to check for new articles:", error);
      }
    };
    checkNewArticles();
  }, [currentUser]);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('currentUser');
    } finally {
        setLoading(false);
    }
  }, []);

  const markArticlesAsSeen = useCallback(async () => {
    // This function updates localStorage with all current approved article IDs,
    // effectively marking them all as 'seen'.
    try {
        const allArticles = await fetchArticles();
        const approvedArticleIds = allArticles.filter(a => a.Status === 'Approved').map(a => a.ID);
        localStorage.setItem(SEEN_ARTICLES_KEY, JSON.stringify(approvedArticleIds));
        setNewArticleCount(0);
    } catch (error) {
        console.error("Failed to mark articles as seen:", error);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    try {
        const accounts = await fetchAccounts();
        
        // Find user by email, case-insensitively for better UX.
        const normalizedInputEmail = email.trim().toLowerCase();
        const user = accounts.find(
            (acc) => acc.Email && acc.Email.trim().toLowerCase() === normalizedInputEmail
        );

        if (!user) {
            // User not found. Generic error message for security.
            return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
        }

        // Retrieve the stored password.
        const storedPassword = user['Mật khẩu'];

        // Check if the stored password is a valid string.
        if (typeof storedPassword !== 'string' || storedPassword.length === 0) {
            console.error(`Password for user ${email} is missing or invalid.`);
            return { success: false, error: 'Đã xảy ra lỗi với tài khoản của bạn. Vui lòng liên hệ quản trị viên.' };
        }

        // The correct, standard, and secure way to compare passwords:
        // A direct, case-sensitive comparison without any transformations.
        if (storedPassword === pass) {
            if (user['Đã xác minh'] === 'Có') {
                setCurrentUser(user);
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true };
            } else {
                // Account exists but is not verified.
                return {
                    success: false,
                    reason: 'unverified',
                    error: 'Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email.',
                    email: user.Email,
                };
            }
        } else {
            // Password does not match. Generic error.
            return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
        }

    } catch (error) {
        console.error('Login failed:', error);
        return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.' };
    }
  };


  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const register = async (username: string, email: string, pass: string, age: number, role: string) => {
    try {
        const accounts = await fetchAccounts();
        const userExists = accounts.some(acc => acc.Email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            return { success: false, error: 'Email này đã được sử dụng.' };
        }
      
        const response = await registerUser({
            'Tên tài khoản': username,
            Email: email,
            'Mật khẩu': pass,
            'Tuổi': age,
            'Vai trò': role as any,
        });

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi đăng ký.' };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      return await resendVerificationEmailService(email);
    } catch (error) {
      console.error('Resending verification email failed:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi gửi lại email.' };
    }
  };

  const updateUserStats = useCallback((attempted: number, correct: number) => {
    setCurrentUser(prevUser => {
        if (!prevUser) return null;

        // Optimistic UI update
        const updatedUser: Account = {
            ...prevUser,
            'Tổng số câu hỏi đã làm': (prevUser['Tổng số câu hỏi đã làm'] || 0) + attempted,
            'Tổng số câu hỏi đã làm đúng': (prevUser['Tổng số câu hỏi đã làm đúng'] || 0) + correct,
            'Tổng số câu hỏi đã làm trong tuần': (prevUser['Tổng số câu hỏi đã làm trong tuần'] || 0) + attempted,
            'Tổng số câu hỏi đã làm đúng trong tuần': (prevUser['Tổng số câu hỏi đã làm đúng trong tuần'] || 0) + correct,
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Persist to backend (fire and forget)
        updateUserQuizStats(prevUser.Email, attempted, correct)
            .then(response => {
                if (!response.success) {
                    console.error("Failed to sync quiz stats to backend:", response.error);
                }
            })
            .catch(err => {
                 console.error("Error calling updateUserQuizStats service:", err);
            });
            
        return updatedUser;
    });
  }, []);

  const deductTokensForPractice = useCallback(() => {
    const userEmail = currentUser?.Email;
    if (!userEmail) {
        showToast('Lỗi: Không tìm thấy người dùng để trừ token.', 'error');
        return;
    }

    // 1. Optimistic UI update
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const optimisticallyUpdatedUser: Account = {
        ...prevUser,
        'Tokens': Math.max(0, (prevUser['Tokens'] || 0) - 100),
      };
      sessionStorage.setItem('currentUser', JSON.stringify(optimisticallyUpdatedUser));
      return optimisticallyUpdatedUser;
    });

    // 2. Async backend call
    deductPracticeTokens(userEmail)
      .then(response => {
        if (response.success) {
          if (typeof response.newTokens === 'number') {
            setCurrentUser(currentUserNow => {
              if (!currentUserNow) return null;
              const confirmedUser = { ...currentUserNow, Tokens: response.newTokens! };
              sessionStorage.setItem('currentUser', JSON.stringify(confirmedUser));
              return confirmedUser;
            });
          }
           showToast('Đã sử dụng 100 token cho phiên luyện tập.', 'success');
        } else {
          console.error("Failed to sync token deduction to backend:", response.error);
          setCurrentUser(currentUserNow => {
            if (!currentUserNow) return null;
            const revertedUser = { ...currentUserNow, 'Tokens': (currentUserNow['Tokens'] || 0) + 100 };
            sessionStorage.setItem('currentUser', JSON.stringify(revertedUser));
            return revertedUser;
          });
          showToast(`Hoàn lại token. Lỗi: ${response.error || 'Không thể đồng bộ với máy chủ.'}`, 'error');
        }
      })
      .catch(err => {
        console.error("Network error during token deduction:", err);
        setCurrentUser(currentUserNow => {
          if (!currentUserNow) return null;
          const revertedUser = { ...currentUserNow, 'Tokens': (currentUserNow['Tokens'] || 0) + 100 };
          sessionStorage.setItem('currentUser', JSON.stringify(revertedUser));
          return revertedUser;
        });
        showToast(`Hoàn lại token. Lỗi: ${err.message || 'Lỗi mạng.'}`, 'error');
      });
  }, [currentUser, showToast]);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    resendVerificationEmail,
    updateUserStats,
    deductTokensForPractice,
    newArticleCount,
    markArticlesAsSeen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};