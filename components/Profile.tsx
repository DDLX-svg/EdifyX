
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAccounts, fetchArticles } from '../services/googleSheetService';
import type { Account, ScientificArticle, Badge } from '../types';
import { Icon } from './shared/Icon';


// --- Badge Logic ---

// Determines the practice-related badge for a user
const getPracticeBadge = (user: Account): Badge => {
    const total = user['Tổng số câu hỏi đã làm'] || 0;
    const correct = user['Tổng số câu hỏi đã làm đúng'] || 0;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    // Special roles override other badges
    if (user['Danh hiệu'] === 'Developer') {
        return { name: 'Developer', description: 'Người xây dựng và phát triển hệ thống SuniMed.', icon: 'settings', color: 'bg-gray-800' };
    }
    if (user['Danh hiệu'] === 'Admin') {
        return { name: 'Quản trị viên', description: 'Quản lý và duy trì nội dung của SuniMed.', icon: 'admin', color: 'bg-red-600' };
    }
    if (user['Danh hiệu'] === 'Cộng tác viên') {
        return { name: 'Cộng tác viên', description: 'Dành cho những thành viên tích cực đóng góp tài liệu chất lượng cho cộng đồng.', icon: 'users', color: 'bg-pink-500' };
    }
    if (user['Danh hiệu'] === 'Đại sứ SuniMed') {
        return { name: 'Đại sứ SuniMed', description: 'Người đại diện cho giá trị và tinh thần của cộng đồng SuniMed.', icon: 'megaphone', color: 'bg-fuchsia-600' };
    }
    
    // Achievement-based badges (ordered by prestige)
    if (total > 200 && accuracy >= 98) {
        return { name: 'Siêu Chính Xác', description: 'Đạt độ chính xác trên 98% với hơn 200 câu hỏi.', icon: 'target', color: 'bg-rose-500' };
    }
    if (total > 50 && accuracy >= 95) {
        return { name: 'Bậc Thầy Chính Xác', description: 'Đạt độ chính xác trên 95% với hơn 50 câu hỏi.', icon: 'star', color: 'bg-amber-500' };
    }
     if (total >= 1000) {
        return { name: 'Huyền Thoại Sống', description: 'Đã chinh phục hơn 1000 câu hỏi trên hệ thống.', icon: 'trophy-solid', color: 'bg-violet-600' };
    }
    if (total >= 500) {
        return { name: 'Lão Làng SuniMed', description: 'Đã chinh phục hơn 500 câu hỏi trên hệ thống.', icon: 'trophy', color: 'bg-purple-600' };
    }
    if (total >= 200) {
        return { name: 'Chiến Binh Tri Thức', description: 'Đã hoàn thành hơn 200 câu hỏi.', icon: 'practice', color: 'bg-blue-500' };
    }
    if (total >= 50) {
        return { name: 'Học Viên Chăm Chỉ', description: 'Hoàn thành 50 câu hỏi đầu tiên.', icon: 'academic-cap', color: 'bg-teal-500' };
    }
    
    return { name: 'Tân Binh', description: 'Bắt đầu hành trình chinh phục kiến thức.', icon: 'user', color: 'bg-green-500' };
};

// Determines the research-related badge for a user
const getResearchBadge = (approvedArticleCount: number): Badge | null => {
    if (approvedArticleCount >= 50) {
        return { name: 'Nhà Khoa Học Tiên Phong', description: 'Đóng góp 50+ công trình nghiên cứu khoa học.', icon: 'rocket', color: 'bg-slate-700' };
    }
    if (approvedArticleCount >= 20) {
        return { name: 'Giáo Sư', description: 'Đóng góp 20+ công trình nghiên cứu khoa học.', icon: 'academic-cap-solid', color: 'bg-cyan-600' };
    }
    if (approvedArticleCount >= 10) {
        return { name: 'Tiến Sĩ', description: 'Đóng góp 10+ công trình nghiên cứu khoa học.', icon: 'beaker', color: 'bg-indigo-600' };
    }
    if (approvedArticleCount >= 5) {
        return { name: 'Học Giả', description: 'Đóng góp 5+ công trình nghiên cứu cho cộng đồng.', icon: 'book', color: 'bg-sky-500' };
    }
    if (approvedArticleCount >= 1) {
        return { name: 'Nhà Nghiên cứu', description: 'Có bài báo khoa học đầu tiên được phê duyệt.', icon: 'document', color: 'bg-orange-500' };
    }
    
    return null; // No research badge if no approved articles
};

// --- Components ---

const StatCard: React.FC<{ icon: string; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const BadgeDisplayCard: React.FC<{ badge: Badge | null, title: string }> = ({ badge, title }) => {
    if (!badge) {
        return (
            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4 h-full border-l-4 border-gray-200">
                <div className="p-3 rounded-full bg-gray-300">
                    <Icon name="question" className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500">{title}</p>
                    <p className="text-sm text-gray-500">Chưa có thành tích</p>
                </div>
            </div>
        );
    }
    
    // Convert Tailwind color to a hex value for the border
    const colorMap: {[key: string]: string} = {
        'bg-gray-800': '#1F2937', 'bg-red-600': '#DC2626', 'bg-amber-500': '#F59E0B',
        'bg-purple-600': '#9333EA', 'bg-blue-500': '#3B82F6', 'bg-teal-500': '#14B8A6',
        'bg-green-500': '#22C55E', 'bg-indigo-600': '#4F46E5', 'bg-sky-500': '#0EA5E9',
        'bg-orange-500': '#F97316', 'bg-rose-500': '#F43F5E', 'bg-violet-600': '#7C3AED',
        'bg-slate-700': '#334155', 'bg-cyan-600': '#0891B2', 'bg-pink-500': '#EC4899',
        'bg-fuchsia-600': '#C026D3'
    };
    const borderColor = colorMap[badge.color] || badge.color;

    return (
        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border-l-4" style={{ borderColor }}>
             <div className={`p-3 rounded-full ${badge.color}`}>
                <Icon name={badge.icon} className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-lg font-bold text-gray-800">{badge.name}</p>
                <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
            </div>
        </div>
    );
};


const Profile: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [profileUser, setProfileUser] = useState<Account | null>(null);
  const [userArticles, setUserArticles] = useState<ScientificArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleFilter, setArticleFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const parseVNDate = (dateStr?: string): number => {
    if (!dateStr || typeof dateStr !== 'string') return 0;
    const parts = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?/);
    if (!parts) {
        const parsed = Date.parse(dateStr);
        return isNaN(parsed) ? 0 : parsed;
    }
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    const year = parseInt(parts[3], 10);
    const hour = parseInt(parts[4], 10) || 0;
    const minute = parseInt(parts[5], 10) || 0;
    const second = parseInt(parts[6], 10) || 0;
    const date = new Date(year, month, day, hour, minute, second);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!email) {
        setError('Không tìm thấy email người dùng.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [accounts, articles] = await Promise.all([fetchAccounts(), fetchArticles()]);
        const user = accounts.find(acc => acc.Email.toLowerCase() === email.toLowerCase());
        if (user) {
          setProfileUser(user);
          const articlesByUser = articles.filter(art => art.SubmitterEmail.toLowerCase() === email.toLowerCase());
          setUserArticles(articlesByUser);
        } else {
          setError('Không tìm thấy hồ sơ người dùng.');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu hồ sơ.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [email]);
  
  const processedArticles = useMemo(() => {
    const statusOrder = {
        'Pending': 1,
        'Approved': 2,
        'Rejected': 3,
    };
    const sorted = [...userArticles].sort((a, b) => {
        const orderA = statusOrder[a.Status as keyof typeof statusOrder] || 99;
        const orderB = statusOrder[b.Status as keyof typeof statusOrder] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return parseVNDate(b.SubmissionDate) - parseVNDate(a.SubmissionDate);
    });
    if (articleFilter === 'All') return sorted;
    return sorted.filter(art => art.Status === articleFilter);
  }, [userArticles, articleFilter]);
  
  const articleCounts = useMemo(() => {
    return userArticles.reduce((acc, article) => {
        const status = article.Status as keyof typeof acc;
        if (acc[status] !== undefined) {
            acc[status]++;
        }
        acc.All++;
        return acc;
    }, { All: 0, Pending: 0, Approved: 0, Rejected: 0 });
  }, [userArticles]);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error || !profileUser) {
    return (
        <div className="text-center p-10 bg-red-50 rounded-lg max-w-md mx-auto">
            <Icon name="x-circle" className="w-12 h-12 mx-auto text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-red-800">Không thể tải hồ sơ</h2>
            <p className="mt-2 text-red-700">{error || 'Người dùng không tồn tại.'}</p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700">
                Về trang chủ
            </Link>
        </div>
    );
  }
  
  const totalQuestions = profileUser['Tổng số câu hỏi đã làm'];
  const correctQuestions = profileUser['Tổng số câu hỏi đã làm đúng'];
  const accuracy = totalQuestions > 0 ? ((correctQuestions / totalQuestions) * 100).toFixed(1) + '%' : 'N/A';
  
  const practiceBadge = getPracticeBadge(profileUser);
  const researchBadge = getResearchBadge(articleCounts.Approved);

  const filterTabs: { id: typeof articleFilter, name: string }[] = [
    { id: 'All', name: 'Tất cả' },
    { id: 'Pending', name: 'Chờ duyệt' },
    { id: 'Approved', name: 'Đã duyệt' },
    { id: 'Rejected', name: 'Bị từ chối' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Profile Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
         <div className="flex-shrink-0 relative">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-gray-100">
            {profileUser['Tên tài khoản'].charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-extrabold text-gray-800">{profileUser['Tên tài khoản']}</h1>
          <p className="text-lg text-gray-500 mt-1">{profileUser['Gói đăng ký']}</p>
          <p className="text-gray-400 mt-2">{profileUser.Email}</p>
        </div>
      </div>

       {/* Badges Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh hiệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BadgeDisplayCard badge={practiceBadge} title="Thành tích Luyện tập" />
          <BadgeDisplayCard badge={researchBadge} title="Thành tích Nghiên cứu" />
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thống kê học tập</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="question" label="Tổng câu đã làm" value={totalQuestions} color="bg-blue-500" />
              <StatCard icon="checkmark" label="Tổng câu đúng" value={correctQuestions} color="bg-green-500" />
              <StatCard icon="trophy" label="Tỷ lệ chính xác" value={accuracy} color="bg-orange-500" />
              <StatCard icon="flame" label="Câu đúng (tuần)" value={profileUser['Tổng số câu hỏi đã làm đúng trong tuần']} color="bg-red-500" />
          </div>
      </div>
      
      {/* Activity Card */}
       <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoạt động khoa học</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                     {filterTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setArticleFilter(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                articleFilter === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.name} <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs ${articleFilter === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{articleCounts[tab.id]}</span>
                        </button>
                    ))}
                </nav>
            </div>
            {processedArticles.length > 0 ? (
                 <div className="mt-4 space-y-4">
                    {processedArticles.map(article => {
                        const statusConfig = {
                            'Approved': { text: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
                            'Pending': { text: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
                            'Rejected': { text: 'Bị từ chối', color: 'bg-red-100 text-red-800' }
                        };
                        const statusInfo = statusConfig[article.Status as keyof typeof statusConfig] || { text: article.Status, color: 'bg-gray-100 text-gray-800' };

                        const Wrapper = ({children}: {children: React.ReactNode}) => 
                            article.Status === 'Approved' ? 
                            <Link to={`/article/${article.ID}`} className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">{children}</Link> :
                            <div className="p-4 rounded-lg bg-gray-50 cursor-not-allowed">{children}</div>;
                        
                        return (
                             <Wrapper key={article.ID}>
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className={`font-bold ${article.Status === 'Approved' ? 'text-blue-700 hover:underline' : 'text-gray-800'}`}>{article.Title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{article.Authors}</p>
                                    </div>
                                    <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                                    <span>{article.SubmissionDate.split(' ')[0]}</span>
                                    <span className="font-mono">SM_DOI: {article.SM_DOI}</span>
                                </div>
                            </Wrapper>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-b-lg mt-4">
                    <Icon name="beaker" className="w-16 h-16 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                        {userArticles.length === 0 ? "Chưa có hoạt động" : "Không có bài báo phù hợp"}
                    </h3>
                    <p className="mt-1">
                        {userArticles.length === 0 
                            ? "Người dùng này chưa đăng bài báo khoa học nào."
                            : `Không có bài báo nào ở trạng thái "${filterTabs.find(t => t.id === articleFilter)?.name}".`
                        }
                    </p>
                     <Link to="/articles/submit" className="mt-4 inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700">
                        Đóng góp ngay
                    </Link>
                </div>
            )}
        </div>
    </div>
  );
};

export default Profile;
