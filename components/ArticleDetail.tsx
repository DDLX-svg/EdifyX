
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticles, fetchAccounts } from '../services/googleSheetService.ts';
import type { ScientificArticle, Account, Badge } from '../types.ts';
import { Icon } from './shared/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

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
        <div className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full ${badge.color} cursor-pointer`}>
            <Icon name={badge.icon} className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white whitespace-nowrap">{badge.name}</span>
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


const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<ScientificArticle | null>(null);
    const [authorBadges, setAuthorBadges] = useState<{ practice: Badge | null, research: Badge | null }>({ practice: null, research: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadArticle = async () => {
            if (!id) {
                setError("ID bài báo không hợp lệ.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const [allArticles, allAccounts] = await Promise.all([
                    fetchArticles(),
                    fetchAccounts()
                ]);

                const foundArticle = allArticles.find(a => a.ID === id);
                if (foundArticle) {
                    setArticle(foundArticle);

                    const authorAccount = allAccounts.find(acc => acc.Email.toLowerCase() === foundArticle.SubmitterEmail.toLowerCase());
                    if (authorAccount) {
                        const approvedCount = allArticles.filter(art => 
                            art.SubmitterEmail.toLowerCase() === authorAccount.Email.toLowerCase() && art.Status === 'Approved'
                        ).length;

                        const researchBadge = getResearchBadge(approvedCount);
                        const practiceBadge = getPracticeBadge(authorAccount);
                        setAuthorBadges({ research: researchBadge, practice: practiceBadge });
                    }
                } else {
                    setError("Không tìm thấy bài báo.");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu bài báo.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadArticle();
    }, [id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (error || !article) {
        return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">{error || "Không thể hiển thị bài báo."}</div>;
    }
    
    const canViewAdminContent = currentUser && (currentUser['Danh hiệu'] === 'Admin' || currentUser['Danh hiệu'] === 'Developer');
    const isAuthor = currentUser?.Email === article.SubmitterEmail;

    if (article.Status !== 'Approved' && !canViewAdminContent && !isAuthor) {
        return (
             <div className="text-center p-10 bg-yellow-50 rounded-lg max-w-md mx-auto">
                <Icon name="information-circle" className="w-12 h-12 mx-auto text-yellow-400" />
                <h2 className="mt-4 text-xl font-bold text-yellow-800">Bài viết đang chờ duyệt</h2>
                <p className="mt-2 text-yellow-700">Bài viết này chưa được phê duyệt và không thể xem công khai.</p>
                <Link to="/articles" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <Link to="/articles" className="text-blue-600 hover:underline flex items-center gap-2 text-sm mb-6">
                <Icon name="arrowLeft" className="w-4 h-4" />
                Quay lại danh sách
            </Link>

            <article className="space-y-6">
                <header>
                    {(canViewAdminContent || isAuthor) && article.Status !== 'Approved' && (
                        <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${
                            article.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            article.Status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                        }`}>
                            {article.Status === 'Pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
                        </div>
                    )}
                    <p className="text-sm font-semibold text-blue-600">{article.Category}</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">{article.Title}</h1>
                    <div className="text-md text-gray-600 mt-4 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold shrink-0">Tác giả:</span> 
                        <span>{article.Authors}</span>
                        {authorBadges.research && <BadgePill badge={authorBadges.research} />}
                        {authorBadges.practice && <BadgePill badge={authorBadges.practice} />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Đăng ngày: {article.SubmissionDate.split(' ')[0]}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-mono select-all">
                        SM_DOI: {article.SM_DOI}
                    </p>
                </header>

                <div className="border-t border-b border-gray-200 py-6">
                    <h2 className="text-xl font-bold text-gray-800">Tóm tắt</h2>
                    <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">{article.Abstract}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">Từ khóa:</span>
                    {article.Keywords.split(',').map(kw => kw.trim()).filter(Boolean).map(keyword => (
                        <span key={keyword} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{keyword}</span>
                    ))}
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Toàn văn</h2>
                     {(() => {
                        if (article.DocumentURL && article.DocumentURL.startsWith('text://')) {
                            const fullText = article.DocumentURL.substring(7);
                            return (
                                <div className="bg-gray-50 p-6 rounded-md prose max-w-none">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{fullText}</p>
                                </div>
                            );
                        } else if (article.DocumentURL) {
                            return (
                                <a
                                    href={article.DocumentURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Icon name="document" className="w-5 h-5" />
                                    Đọc toàn văn (PDF)
                                </a>
                            );
                        } else {
                            return <p className="text-gray-500 italic">Không có nội dung toàn văn hoặc liên kết PDF cho bài báo này.</p>;
                        }
                    })()}
                </div>

                {(canViewAdminContent || isAuthor) && article.Feedback && (
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Phản hồi từ quản trị viên</h2>
                        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                             <p className="text-blue-800 whitespace-pre-wrap">{article.Feedback}</p>
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default ArticleDetail;
