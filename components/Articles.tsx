import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchArticles } from '../services/googleSheetService';
import type { ScientificArticle } from '../types';
import { Icon } from './shared/Icon';

const ArticleCard: React.FC<{ article: ScientificArticle }> = ({ article }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col">
        <Link to={`/article/${article.ID}`} className="block mb-2">
            <h3 className="text-xl font-bold text-blue-700 hover:underline line-clamp-2">{article.Title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold">Tác giả:</span> {article.Authors}
        </p>
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
        const loadArticles = async () => {
            try {
                setIsLoading(true);
                const data = await fetchArticles();
                 
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

                const sortedData = data.sort((a, b) => parseVNDate(b.SubmissionDate) - parseVNDate(a.SubmissionDate));
                setArticles(sortedData);
                setError(null);
            } catch (err) {
                setError('Không thể tải các bài báo khoa học. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadArticles();
    }, []);

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
                    {filteredArticles.map(article => (
                        <ArticleCard key={article.ID} article={article} />
                    ))}
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