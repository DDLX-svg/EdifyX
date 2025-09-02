
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchAccounts, registerUser, resendVerificationEmail as resendVerificationEmailService, fetchArticles } from '../services/googleSheetService.ts';
import type { Account } from '../types.ts';

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
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserStats: (attempted: number, correct: number) => void;
  newArticleCount: number;
  markArticlesAsSeen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [newArticleCount, setNewArticleCount] = useState(0);

  const SEEN_ARTICLES_KEY = 'sunimed_seen_articles_v1';

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
      const user = accounts.find(
        (acc) => acc.Email.toLowerCase() === email.toLowerCase() && acc['Mật khẩu'] === pass
      );
      if (user) {
        if (user['Đã xác minh'] !== 'Có') {
            return {
                success: false,
                reason: 'unverified',
                email: user.Email,
                error: 'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email.'
            };
        }
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const register = async (username: string, email: string, pass: string) => {
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

        const updatedUser: Account = {
            ...prevUser,
            'Tổng số câu hỏi đã làm': (prevUser['Tổng số câu hỏi đã làm'] || 0) + attempted,
            'Tổng số câu hỏi đã làm đúng': (prevUser['Tổng số câu hỏi đã làm đúng'] || 0) + correct,
            'Tổng số câu hỏi đã làm trong tuần': (prevUser['Tổng số câu hỏi đã làm trong tuần'] || 0) + attempted,
            'Tổng số câu hỏi đã làm đúng trong tuần': (prevUser['Tổng số câu hỏi đã làm đúng trong tuần'] || 0) + correct,
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    resendVerificationEmail,
    updateUserStats,
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