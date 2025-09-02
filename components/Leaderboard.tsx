import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAccounts, fetchArticles } from '../services/googleSheetService.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { Account } from '../types.ts';
import { Icon } from './shared/Icon.tsx';
import QuizConfigModal, { QuizOption } from './shared/QuizConfigModal.tsx';

const getRankDisplay = (rank: number) => {
    if (rank === 1) {
        return <Icon name="medal" className="w-8 h-8 mx-auto text-yellow-400" />;
    }
    if (rank === 2) {
        return <Icon name="medal" className="w-8 h-8 mx-auto text-gray-400" />;
    }
    if (rank === 3) {
        return <Icon name="medal" className="w-8 h-8 mx-auto text-orange-500" />;
    }
    return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full mx-auto font-semibold bg-gray-200 text-gray-700">
            {rank}
        </span>
    );
};

// --- Weekly Leaderboard Component ---
interface WeeklyLeaderboardUser extends Account {
    rank: number;
    accuracy: number;
}

const WeeklyLeaderboardTab: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadLeaderboard = async () => {
            setIsLoading(true);
            try {
                const accounts = await fetchAccounts();
                const sortedAccounts = accounts
                    .filter(a => a['Tổng số câu hỏi đã làm trong tuần'] > 0)
                    .sort((a, b) => {
                        const weeklyCorrectDiff = b['Tổng số câu hỏi đã làm đúng trong tuần'] - a['Tổng số câu hỏi đã làm đúng trong tuần'];
                        if (weeklyCorrectDiff !== 0) return weeklyCorrectDiff;
                        
                        const accuracyB = b['Tổng số câu hỏi đã làm trong tuần'] > 0 ? b['Tổng số câu hỏi đã làm đúng trong tuần'] / b['Tổng số câu hỏi đã làm trong tuần'] : 0;
                        const accuracyA = a['Tổng số câu hỏi đã làm trong tuần'] > 0 ? a['Tổng số câu hỏi đã làm đúng trong tuần'] / a['Tổng số câu hỏi đã làm trong tuần'] : 0;
                        const accuracyDiff = accuracyB - accuracyA;
                        if (accuracyDiff !== 0) return accuracyDiff;

                        return b['Tổng số câu hỏi đã làm trong tuần'] - a['Tổng số câu hỏi đã làm trong tuần'];
                    });

                const rankedUsers = sortedAccounts.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                    accuracy: user['Tổng số câu hỏi đã làm trong tuần'] > 0
                        ? (user['Tổng số câu hỏi đã làm đúng trong tuần'] / user['Tổng số câu hỏi đã làm trong tuần']) * 100
                        : 0,
                }));
                
                setLeaderboard(rankedUsers);
            } catch (err) {
                setError('Không thể tải bảng xếp hạng. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    const currentUserRankData = leaderboard.find(user => user.Email === currentUser?.Email);

    const challengeOptions: QuizOption[] = [
        { questions: 10, time: 5 },
        { questions: 25, time: 12 },
        { questions: 50, time: 25 },
    ];

    const handleStartChallenge = (config: QuizOption) => {
        setIsModalOpen(false);
        navigate('/challenge-quiz', { state: config });
    };

    const renderTable = () => {
        if (isLoading) return <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-4">Đang tải bảng xếp hạng...</p></div>;
        if (error) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">{error}</div>;
        if (leaderboard.length === 0) return <div className="text-center py-10 text-gray-500">Chưa có ai tham gia thử thách tuần này. Hãy là người đầu tiên!</div>;

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">Hạng</th>
                            <th scope="col" className="px-6 py-3">Tên tài khoản</th>
                            <th scope="col" className="px-6 py-3 text-center">Câu đã làm (tuần)</th>
                            <th scope="col" className="px-6 py-3 text-center">Câu đúng (tuần)</th>
                            <th scope="col" className="px-6 py-3 text-center">Tỷ lệ chính xác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user) => (
                            <tr key={user.Email} className={`border-b ${currentUser?.Email === user.Email ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-6 py-4">{getRankDisplay(user.rank)}</td>
                                <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                    <Link to={`/profile/${user.Email}`} className="hover:underline">{user['Tên tài khoản']}</Link>
                                </th>
                                <td className="px-6 py-4 text-center">{user['Tổng số câu hỏi đã làm trong tuần']}</td>
                                <td className="px-6 py-4 text-center">{user['Tổng số câu hỏi đã làm đúng trong tuần']}</td>
                                <td className="px-6 py-4 text-center font-semibold">{user.accuracy.toFixed(0)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold">Thử thách hàng tuần</h2>
                    <p className="mt-2 text-blue-100 max-w-2xl">
                        Kiểm tra kiến thức của bạn với bộ câu hỏi tổng hợp và leo lên đỉnh bảng xếp hạng tuần này!
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg group inline-flex items-center"
                >
                    Bắt đầu thử thách <Icon name="arrowRight" className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>

            {currentUserRankData && (
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="font-bold text-gray-800 mb-2">Thứ hạng của bạn</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">Hạng</p>
                            <p className="text-2xl font-bold text-blue-600">{currentUserRankData.rank}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Câu đã làm</p>
                            <p className="text-2xl font-bold">{currentUserRankData['Tổng số câu hỏi đã làm trong tuần']}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Câu đúng</p>
                            <p className="text-2xl font-bold">{currentUserRankData['Tổng số câu hỏi đã làm đúng trong tuần']}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Chính xác</p>
                            <p className="text-2xl font-bold">{currentUserRankData.accuracy.toFixed(0)}%</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-lg">
                {renderTable()}
            </div>

            <QuizConfigModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStart={handleStartChallenge}
                title="Cấu hình Thử thách"
                options={challengeOptions}
            />
        </div>
    );
};


// --- Research Leaderboard Component ---
interface ResearchLeaderboardUser extends Account {
    rank: number;
    approvedArticlesCount: number;
}

const ResearchLeaderboardTab: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<ResearchLeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadLeaderboard = async () => {
            setIsLoading(true);
            try {
                const [accounts, articles] = await Promise.all([fetchAccounts(), fetchArticles()]);
                
                const approvedArticles = articles.filter(a => a.Status === 'Approved');
                
                const articleCounts: { [email: string]: number } = {};
                for (const article of approvedArticles) {
                    const email = article.SubmitterEmail.toLowerCase();
                    articleCounts[email] = (articleCounts[email] || 0) + 1;
                }

                const rankedUsersData = accounts
                    .map(account => ({
                        ...account,
                        approvedArticlesCount: articleCounts[account.Email.toLowerCase()] || 0,
                    }))
                    .filter(user => user.approvedArticlesCount > 0)
                    .sort((a, b) => b.approvedArticlesCount - a.approvedArticlesCount)
                    .map((user, index) => ({
                        ...user,
                        rank: index + 1,
                    }));
                
                setLeaderboard(rankedUsersData);
            } catch (err) {
                setError('Không thể tải bảng xếp hạng. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    const currentUserRankData = leaderboard.find(user => user.Email === currentUser?.Email);

    const renderTable = () => {
        if (isLoading) return <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-4">Đang tải bảng xếp hạng...</p></div>;
        if (error) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">{error}</div>;
        if (leaderboard.length === 0) return <div className="text-center py-10 text-gray-500">Chưa có đóng góp nghiên cứu nào được ghi nhận.</div>;

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">Hạng</th>
                            <th scope="col" className="px-6 py-3">Tên tài khoản</th>
                            <th scope="col" className="px-6 py-3 text-center">Số bài báo đã duyệt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user) => (
                            <tr key={user.Email} className={`border-b ${currentUser?.Email === user.Email ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-6 py-4">{getRankDisplay(user.rank)}</td>
                                <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                    <Link to={`/profile/${user.Email}`} className="hover:underline">{user['Tên tài khoản']}</Link>
                                </th>
                                <td className="px-6 py-4 text-center font-semibold text-lg">{user.approvedArticlesCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-8">
                <h2 className="text-3xl font-bold">Bảng vinh danh nghiên cứu</h2>
                <p className="mt-2 text-purple-100 max-w-2xl">
                    Ghi nhận những đóng góp khoa học giá trị nhất từ các nhà nghiên cứu trong cộng đồng SuniMed.
                </p>
            </div>
            {currentUserRankData && (
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="font-bold text-gray-800 mb-2">Thành tích nghiên cứu của bạn</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">Hạng</p>
                            <p className="text-2xl font-bold text-purple-600">{currentUserRankData.rank}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số bài báo duyệt</p>
                            <p className="text-2xl font-bold">{currentUserRankData.approvedArticlesCount}</p>
                        </div>
                    </div>
                </div>
            )}
             <div className="bg-white rounded-2xl shadow-lg">
                {renderTable()}
            </div>
        </div>
    )
};


// --- Main Leaderboard Component ---
const Leaderboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'weekly' | 'research'>('weekly');
    
    const tabs = [
        { id: 'weekly', name: 'Thử thách tuần', icon: 'flame', component: <WeeklyLeaderboardTab /> },
        { id: 'research', name: 'Nghiên cứu', icon: 'academic-cap', component: <ResearchLeaderboardTab /> },
    ];

    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Bảng xếp hạng</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Theo dõi thành tích của bạn và những người khác trong cộng đồng SuniMed.
                </p>
            </section>
            
            <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-lg">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon name={tab.icon} className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </div>
                <div className="p-4 sm:p-6">
                    {activeComponent}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;