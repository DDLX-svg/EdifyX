import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAccounts, fetchArticles } from '../services/googleSheetService.ts';
import type { Account, ScientificArticle, Badge } from '../types.ts';
import { Icon } from './shared/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getUserBadges } from '../utils/badgeUtils.ts';
import { BadgePill } from './shared/BadgePill.tsx';

const StatCard: React.FC<{ icon: string; value: string | number; label: string; colorClass: string; }> = ({ icon, value, label, colorClass }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);


const Profile: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const { currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState<Account | null>(null);
    const [userArticles, setUserArticles] = useState<ScientificArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfileData = async () => {
            if (!email) {
                setError("Email người dùng không hợp lệ.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const [accounts, articles] = await Promise.all([
                    fetchAccounts(),
                    fetchArticles()
                ]);

                const foundUser = accounts.find(acc => acc.Email.toLowerCase() === email.toLowerCase());
                if (foundUser) {
                    setProfileUser(foundUser);
                    const foundArticles = articles.filter(art => art.SubmitterEmail.toLowerCase() === email.toLowerCase());
                    setUserArticles(foundArticles);
                } else {
                    setError("Không tìm thấy người dùng.");
                }
            } catch (err) {
                setError("Không thể tải dữ liệu hồ sơ.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [email]);

    const { allBadges, mainBadge, weeklyStats, totalStats } = useMemo(() => {
        if (!profileUser) {
            return { allBadges: [], mainBadge: null, weeklyStats: { attempted: 0, correct: 0, accuracy: 0 }, totalStats: { attempted: 0, correct: 0, accuracy: 0 } };
        }

        const badges = getUserBadges(profileUser, userArticles);
        const primaryBadge = badges.find(b => ['Developer', 'Admin', 'Giáo sư', 'Nhà bác học', 'Siêu thiên tài'].includes(b.name)) || badges[0] || null;

        const weekly = {
            attempted: profileUser['Tổng số câu hỏi đã làm trong tuần'] || 0,
            correct: profileUser['Tổng số câu hỏi đã làm đúng trong tuần'] || 0,
            accuracy: (profileUser['Tổng số câu hỏi đã làm trong tuần'] || 0) > 0
                ? ((profileUser['Tổng số câu hỏi đã làm đúng trong tuần'] || 0) / profileUser['Tổng số câu hỏi đã làm trong tuần']) * 100
                : 0
        };

        const total = {
            attempted: profileUser['Tổng số câu hỏi đã làm'] || 0,
            correct: profileUser['Tổng số câu hỏi đã làm đúng'] || 0,
            accuracy: (profileUser['Tổng số câu hỏi đã làm'] || 0) > 0
                ? ((profileUser['Tổng số câu hỏi đã làm đúng'] || 0) / profileUser['Tổng số câu hỏi đã làm']) * 100
                : 0
        };

        return { allBadges: badges, mainBadge: primaryBadge, weeklyStats: weekly, totalStats: total };
    }, [profileUser, userArticles]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (error || !profileUser) {
        return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">{error || "Không thể hiển thị hồ sơ."}</div>;
    }

    const getStatusPill = (status: string) => {
        switch (status) {
            case 'Approved': return <span className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">Đã duyệt</span>;
            case 'Pending': return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">Chờ duyệt</span>;
            case 'Rejected': return <span className="text-xs font-medium bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">Bị từ chối</span>;
            default: return <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                        <Icon name="user" className="w-12 h-12 text-blue-500" />
                    </div>
                    {mainBadge && (
                         <div className={`absolute -bottom-2 -right-2 p-2 rounded-full ${mainBadge.color} shadow-md`}>
                            <Icon name={mainBadge.icon} className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{profileUser['Tên tài khoản']}</h1>
                    <p className="text-md text-gray-500">{profileUser['Vai trò']}</p>
                    <div className="flex gap-2 justify-center md:justify-start mt-2 flex-wrap">
                        {allBadges.map(badge => <BadgePill key={badge.name} badge={badge} />)}
                    </div>
                </div>
                {mainBadge && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center md:text-left flex-shrink-0">
                        <p className="text-sm font-bold text-gray-700">DANH HIỆU NỔI BẬT</p>
                        <div className="flex items-center gap-2 mt-2">
                             <div className={`p-2 rounded-full ${mainBadge.color}`}>
                                <Icon name={mainBadge.icon} className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{mainBadge.name}</p>
                                <p className="text-xs text-gray-500">{mainBadge.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thành tích</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50/70 p-6 rounded-xl space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Icon name="flame" className="w-5 h-5 text-orange-500" />Thành tích tuần này</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard icon="question" value={weeklyStats.attempted} label="Câu đã làm" colorClass="bg-blue-500" />
                            <StatCard icon="checkmark" value={weeklyStats.correct} label="Câu đúng" colorClass="bg-green-500" />
                            <StatCard icon="target" value={`${weeklyStats.accuracy.toFixed(0)}%`} label="Chính xác" colorClass="bg-amber-500" />
                        </div>
                    </div>
                    <div className="bg-gray-50/70 p-6 rounded-xl space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Icon name="trophy" className="w-5 h-5 text-purple-500" />Thành tích tổng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard icon="question" value={totalStats.attempted} label="Câu đã làm" colorClass="bg-sky-500" />
                            <StatCard icon="checkmark" value={totalStats.correct} label="Câu đúng" colorClass="bg-emerald-500" />
                            <StatCard icon="target" value={`${totalStats.accuracy.toFixed(0)}%`} label="Chính xác" colorClass="bg-indigo-500" />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bài báo đã đăng ({userArticles.length})</h2>
                {userArticles.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {userArticles.map(article => (
                                <li key={article.ID} className="p-4 hover:bg-gray-50 transition-colors">
                                    <Link to={`/article/${article.ID}`} className="block">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-blue-700 truncate pr-4">{article.Title}</p>
                                            {getStatusPill(article.Status)}
                                        </div>
                                        <div className="flex justify-between items-baseline mt-2">
                                            <p className="text-sm text-gray-500">{article.Category}</p>
                                            <p className="text-sm text-gray-400">{article.SubmissionDate.split(' ')[0]}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
                        <Icon name="document" className="w-12 h-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">Chưa có bài báo nào</h3>
                        <p className="mt-1 text-gray-500">
                            Người dùng này chưa đăng tải công trình nghiên cứu nào.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Profile;