import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticles, fetchAccounts } from '../services/googleSheetService.ts';
import type { ScientificArticle, Account, Badge } from '../types.ts';
import { Icon } from './shared/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getUserBadges } from '../utils/badgeUtils.ts';
import { BadgePill } from './shared/BadgePill.tsx';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<ScientificArticle | null>(null);
    const [authorBadges, setAuthorBadges] = useState<Badge[]>([]);
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
                        const authorArticles = allArticles.filter(art => 
                            art.SubmitterEmail.toLowerCase() === authorAccount.Email.toLowerCase()
                        );
                        setAuthorBadges(getUserBadges(authorAccount, authorArticles));
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
                        {authorBadges.map(badge => <BadgePill key={badge.name} badge={badge} />)}
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