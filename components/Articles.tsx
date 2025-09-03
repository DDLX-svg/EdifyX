
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchArticles, fetchAccounts } from '../services/googleSheetService.ts';
import type { ScientificArticle, Account, Badge } from '../types.ts';
import { Icon } from './shared/Icon.tsx';

// --- Badge Logic ---
// Determines the practice-related badge for a user
const getPracticeBadge = (user: Account): Badge => {
    const total = user['Tổng số câu hỏi đã làm'] || 0;
    const correct = user['Tổng số câu hỏi đã làm đúng'] || 0;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    // Special roles override other badges
    if (user['Danh hiệu'] === 'Developer') {
        return { name: 'Developer', description: 'Người xây dựng và phát triển hệ thống SuniMed.', icon: 'laptop', color: 'bg-gray-800' };
    }
    if (user['Danh hiệu'] === 'Admin') {
        return { name: 'Quản trị viên', description: 'Quản lý và duy trì nội dung của SuniMed.', icon: 'shield', color: 'bg-red-600' };
    }
    if (user['Danh hiệu'] === 'Bác sĩ chuyên ngành') {
        return { name: 'Bác sĩ chuyên ngành', description: 'Chuyên gia y khoa với kiến thức và kinh nghiệm sâu rộng trong một lĩnh vực cụ thể.', icon: 'stethoscope', color: 'bg-cyan-600' };
    }
    if (user['Danh hiệu'] === 'Dược sĩ chuyên ngành') {
        return { name: 'Dược sĩ chuyên ngành', description: 'Chuyên gia về dược phẩm, đảm bảo việc sử dụng thuốc an toàn và hiệu quả.', icon: 'pill', color: 'bg-lime-600' };
    }
    if (user['Danh hiệu'] === 'Nhà khoa học trẻ') {
        return { name: 'Nhà khoa học trẻ', description: 'Một tài năng trẻ có nhiều đóng góp và tiềm năng trong lĩnh vực nghiên cứu khoa học.', icon: 'beaker', color: 'bg-teal-500' };
    }
    if (user['Danh hiệu'] === 'Cộng tác viên') {
        return { name: 'Cộng tác viên', description: 'Dành cho những thành viên tích cực đóng góp tài liệu chất lượng cho cộng đồng.', icon: 'handshake', color: 'bg-pink-500' };
    }
    if (user['Danh hiệu'] === 'Đại sứ SuniMed') {
        return { name: 'Đại sứ SuniMed', description: 'Người đại diện cho giá trị và tinh thần của cộng đồng SuniMed.', icon: 'globe', color: 'bg-fuchsia-600' };
    }
    
    // Achievement-based badges (ordered by prestige)
    if (total > 200 && accuracy >= 98) {
        return { name: 'Siêu Chính Xác', description: 'Đạt độ chính xác trên 98% với hơn 200 câu hỏi.', icon: 'sparkles', color: 'bg-rose-500' };
    }
    if (total > 50 && accuracy >= 95) {
        return { name: 'Bậc Thầy Chính Xác', description: 'Đạt độ chính xác trên 95% với hơn 50 câu hỏi.', icon: 'target', color: 'bg-amber-500' };
    }
     if (total >= 1000) {
        return { name: 'Huyền Thoại Sống', description: 'Đã chinh phục hơn 1000 câu hỏi trên hệ thống.', icon: 'crown', color: 'bg-violet-600' };
    }
    if (total >= 500) {
        return { name: 'Lão Làng SuniMed', description: 'Đã chinh phục hơn 500 câu hỏi trên hệ thống.', icon: 'building', color: 'bg-purple-600' };
    }
    if (total >= 200) {
        return { name: 'Chiến Binh Tri Thức', description: 'Đã hoàn thành hơn 200 câu hỏi.', icon: 'swords', color: 'bg-blue-500' };
    }
    if (total >= 50) {
        return { name: 'Học Viên Chăm Chỉ', description: 'Hoàn thành 50 câu hỏi đầu tiên.', icon: 'book', color: 'bg-teal-500' };
    }
    
    return { name: 'Tân Binh', description: 'Bắt đầu hành trình chinh phục kiến thức.', icon: 'backpack', color: 'bg-green-500' };
};

// Determines the research-related badge for a user
const getResearchBadge = (approvedArticleCount: number): Badge | null => {
    if (approvedArticleCount >= 250) {
        return { name: 'Siêu thiên tài', description: 'Đóng góp 250+ công trình nghiên cứu, một trí tuệ phi thường.', icon: 'galaxy', color: 'bg-red-700' };
    }
    if (approvedArticleCount >= 150) {
        return { name: 'Nhà bác học', description: 'Đóng góp 150+ công trình nghiên cứu, định hình lại kiến thức y khoa.', icon: 'brain', color: 'bg-slate-700' };
    }
    if (approvedArticleCount >= 100) {
        return { name: 'Giáo sư', description: 'Đóng góp 100+ công trình nghiên cứu khoa học, một học giả uyên bác.', icon: 'trophy-solid', color: 'bg-fuchsia-600' };
    }
    if (approvedArticleCount >= 75) {
        return { name: 'Phó giáo sư', description: 'Đóng góp 75+ công trình nghiên cứu khoa học, đạt được thành tựu đáng kể.', icon: 'trophy', color: 'bg-purple-600' };
    }
    if (approvedArticleCount >= 50) {
        return { name: 'Nhà Khoa học Chuyên nghiệp', description: 'Đóng góp 50+ công trình nghiên cứu khoa học.', icon: 'beaker', color: 'bg-indigo-600' };
    }
    if (approvedArticleCount >= 25) {
        return { name: 'Tiến sĩ', description: 'Đóng góp 25+ công trình nghiên cứu khoa học.', icon: 'trophy', color: 'bg-cyan-600' };
    }
    if (approvedArticleCount >= 10) {
        return { name: 'Thạc sĩ', description: 'Đóng góp 10+ công trình nghiên cứu khoa học.', icon: 'academic-cap', color: 'bg-sky-500' };
    }
    if (approvedArticleCount >= 5) {
        return { name: 'Học Giả', description: 'Đóng góp 5+ công trình nghiên cứu cho cộng đồng.', icon: 'scroll', color: 'bg-blue-500' };
    }
    if (approvedArticleCount >= 1) {
        return { name: 'Nhà Nghiên cứu', description: 'Có bài báo khoa học đầu tiên được phê duyệt.', icon: 'microscope', color: 'bg-orange-500' };
    }
    
    return null; // No research badge if no approved articles
};

const BadgePill: React.FC<{ badge: Badge }> = ({ badge }) => (
    <div className="relative group">
        <div className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full ${badge.color} cursor-pointer`}>
            <Icon name={badge.icon} className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">{badge.name}</span>
        </div>
        <div
            role="tooltip"
            className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10"
        >
            {badge.description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
    </div>
);


const ArticleCard: React.FC<{ article: ScientificArticle; authorBadges: { practice: Badge | null, research: Badge | null } }> = ({ article, authorBadges }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col">
        <Link to={`/article/${article.ID}`} className="block mb-2">
            <h3 className="text-xl font-bold text-blue-700 hover:underline line-clamp-2">{article.Title}</h3>
        </Link>
        <div className="flex items-center gap-x-2 gap-y-1 text-sm text-gray-600 mb-3 flex-wrap">
            <span className="font-semibold shrink-0">Tác giả:</span> 
            <span className="truncate">{article.Authors}</span>
            {authorBadges.research && <BadgePill badge={authorBadges.research} />}
            {authorBadges.practice && <BadgePill badge={authorBadges.practice} />}
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">
            {article.Abstract}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
            {article.Keywords.split(',').map(kw => kw.trim()).filter(Boolean).map(keyword => (
                <span key={keyword} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{keyword}</span>
            ))}
        </div>
        <div className="mt-auto pt-3 border-t text-xs text-gray-400 space-y-1">
            <div className="font-mono text-gray-500">
                SM_DOI: {article.SM_DOI}
            </div>
            <div className="flex justify-between items-center">
                <span>{article.Category}</span>
                <span>{article.SubmissionDate.split(' ')[0]}</span>
            </div>
        </div>
    </div>
);

const Articles: React.FC = () => {
    const [articles, setArticles] = useState<ScientificArticle[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [message, setMessage] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            window.history.replaceState({}, document.title); // Clear state to prevent re-showing
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [artData, accData] = await Promise.all([
                    fetchArticles(),
                    fetchAccounts()
                ]);
                 
                // Helper function for robust date parsing
                const parseVNDate = (dateStr?: string): number => {
                    if (!dateStr || typeof dateStr !== 'string') return 0;
                    // This regex handles D/M/YYYY or DD/MM/YYYY formats, with an optional time part.
                    const parts = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?/);
                    if (!parts) {
                        const parsed = Date.parse(dateStr);
                        return isNaN(parsed) ? 0 : parsed;
                    }
        
                    const day = parseInt(parts[1], 10);
                    const month = parseInt(parts[2], 10) - 1; // JS months are 0-indexed
                    const year = parseInt(parts[3], 10);
                    const hour = parseInt(parts[4], 10) || 0;
                    const minute = parseInt(parts[5], 10) || 0;
                    const second = parseInt(parts[6], 10) || 0;

                    const date = new Date(year, month, day, hour, minute, second);
                    return isNaN(date.getTime()) ? 0 : date.getTime();
                };

                const sortedData = artData.sort((a, b) => parseVNDate(b.SubmissionDate) - parseVNDate(a.SubmissionDate));
                setArticles(sortedData);
                setAccounts(accData);
                setError(null);
            } catch (err) {
                setError('Không thể tải các bài báo khoa học. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const authorBadgesMap = useMemo(() => {
        if (articles.length === 0 || accounts.length === 0) {
            return new Map<string, { practice: Badge | null, research: Badge | null }>();
        }

        const approvedArticlesByEmail: { [email: string]: number } = {};
        articles.forEach(art => {
            if (art.Status === 'Approved') {
                const email = art.SubmitterEmail.toLowerCase();
                approvedArticlesByEmail[email] = (approvedArticlesByEmail[email] || 0) + 1;
            }
        });

        const badgeMap = new Map<string, { practice: Badge | null, research: Badge | null }>();
        accounts.forEach(account => {
            const email = account.Email.toLowerCase();
            const approvedCount = approvedArticlesByEmail[email] || 0;
            
            const researchBadge = getResearchBadge(approvedCount);
            const practiceBadge = getPracticeBadge(account);
            
            badgeMap.set(email, { research: researchBadge, practice: practiceBadge });
        });

        return badgeMap;
    }, [articles, accounts]);

    const filteredArticles = useMemo(() => {
        return articles
            .filter(a => a.Status === 'Approved') // Only show approved articles
            .filter(article => {
                const matchesCategory = categoryFilter === 'All' || article.Category === categoryFilter;
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = searchTerm === '' ||
                    article.Title.toLowerCase().includes(searchLower) ||
                    article.Authors.toLowerCase().includes(searchLower) ||
                    article.Keywords.toLowerCase().includes(searchLower);
                return matchesCategory && matchesSearch;
        });
    }, [articles, searchTerm, categoryFilter]);

    const uniqueCategories = useMemo(() => ['All', ...Array.from(new Set(articles.map(a => a.Category).filter(Boolean)))], [articles]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <section className="text-center">
                <Icon name="academic-cap" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Nghiên cứu khoa học</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Khám phá và chia sẻ các công trình nghiên cứu trong cộng đồng y khoa SuniMed.
                </p>
            </section>
            
            {message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Thành công</p>
                    <p>{message}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-sm border">
                <div className="flex-grow w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm theo tiêu đề, tác giả, từ khóa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="search" className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                     <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'Tất cả chuyên ngành' : cat}</option>
                        ))}
                    </select>
                </div>
                <Link
                    to="/articles/submit"
                    className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0 bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Icon name="plus" className="w-5 h-5" />
                    Đăng bài báo
                </Link>
            </div>

            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => {
                         const authorBadges = authorBadgesMap.get(article.SubmitterEmail.toLowerCase()) || { practice: null, research: null };
                         return <ArticleCard key={article.ID} article={article} authorBadges={authorBadges} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-gray-50 rounded-lg">
                    <Icon name="search" className="w-12 h-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">Không tìm thấy bài báo</h3>
                    <p className="mt-2 text-gray-500">
                        Chưa có bài báo nào được duyệt phù hợp với tìm kiếm của bạn.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Articles;
