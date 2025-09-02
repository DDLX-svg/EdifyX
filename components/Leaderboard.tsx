
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAccounts, fetchArticles } from '../services/googleSheetService';
import { useAuth } from '../contexts/AuthContext';
import type { Account, ScientificArticle } from '../types';
import { Icon } from './shared/Icon';
import QuizConfigModal, { QuizOption } from './shared/QuizConfigModal';

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

// --- Weekly Leaderboard Component (from WeeklyChallenge.tsx) ---
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
                            <th scope="col" className="px-6 py-3 text-center">Tỷ lệ đúng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map(user => (
                            <tr key={user.Email} className={`border-b ${user.Email === currentUser?.Email ? 'bg-blue-50 font-bold' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-6 py-4 text-center">{getRankDisplay(user.rank)}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link to={`/profile/${user.Email}`} className="hover:text-blue-600 hover:underline">{user['Tên tài khoản']}</Link>
                                </td>
                                <td className="px-6 py-4 text-center">{user['Tổng số câu hỏi đã làm trong tuần']}</td>
                                <td className="px-6 py-4 text-center text-green-600 font-semibold">{user['Tổng số câu hỏi đã làm đúng trong tuần']}</td>
                                <td className="px-6 py-4 text-center">{user.accuracy.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-2xl font-bold">Sẵn sàng thử sức?</h3>
                    <p className="mt-1 text-blue-100">Bắt đầu một bài thi mới để cải thiện điểm số và thứ hạng của bạn.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full text-md hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                    Bắt đầu thử thách
                </button>
            </section>
            
             <section className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thành tích của bạn (Tuần)</h2>
                {currentUserRankData ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Thứ hạng</p><p className="text-3xl font-bold text-blue-600">{currentUserRankData.rank}</p></div>
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Câu đã làm</p><p className="text-3xl font-bold text-gray-800">{currentUserRankData['Tổng số câu hỏi đã làm trong tuần']}</p></div>
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Câu đúng</p><p className="text-3xl font-bold text-green-600">{currentUserRankData['Tổng số câu hỏi đã làm đúng trong tuần']}</p></div>
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Tỷ lệ đúng</p><p className="text-3xl font-bold text-gray-800">{currentUserRankData.accuracy.toFixed(1)}%</p></div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-600 bg-gray-50 rounded-lg">
                        <p>Bạn chưa tham gia thử thách tuần này. Hãy hoàn thành một bài thi để có mặt trên bảng xếp hạng!</p>
                    </div>
                )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bảng xếp hạng tuần</h2>
                {renderTable()}
            </section>
            {isModalOpen && <QuizConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStart={handleStartChallenge} title="Cấu hình thử thách" options={challengeOptions} />}
        </div>
    );
};


// --- Research Leaderboard Component ---
interface ResearchLeaderboardUser extends Account {
    rank: number;
    articleCount: number;
}

const ResearchLeaderboardTab: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<ResearchLeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [accounts, articles] = await Promise.all([fetchAccounts(), fetchArticles()]);
                
                const approvedArticles = articles.filter(a => a.Status === 'Approved');
                const articleCounts: { [email: string]: number } = {};

                approvedArticles.forEach(article => {
                    const email = article.SubmitterEmail.toLowerCase();
                    articleCounts[email] = (articleCounts[email] || 0) + 1;
                });
                
                const rankedUsersData = accounts
                    .map(acc => ({ ...acc, articleCount: articleCounts[acc.Email.toLowerCase()] || 0 }))
                    .filter(user => user.articleCount > 0)
                    .sort((a, b) => b.articleCount - a.articleCount)
                    .map((user, index) => ({ ...user, rank: index + 1 }));

                setLeaderboard(rankedUsersData);
            } catch (err) {
                setError('Không thể tải bảng xếp hạng. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const currentUserRankData = leaderboard.find(user => user.Email === currentUser?.Email);

    const renderTable = () => {
        if (isLoading) return <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Đang tải bảng xếp hạng...</p></div>;
        if (error) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">{error}</div>;
        if (leaderboard.length === 0) return <div className="text-center py-10 text-gray-500">Chưa có bài báo khoa học nào được duyệt.</div>;

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
                        {leaderboard.map(user => (
                             <tr key={user.Email} className={`border-b ${user.Email === currentUser?.Email ? 'bg-purple-50 font-bold' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-6 py-4 text-center">{getRankDisplay(user.rank)}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link to={`/profile/${user.Email}`} className="hover:text-purple-600 hover:underline">{user['Tên tài khoản']}</Link>
                                </td>
                                <td className="px-6 py-4 text-center text-purple-600 font-semibold">{user.articleCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-8">
             <section className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thành tích của bạn (Nghiên cứu)</h2>
                {currentUserRankData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Thứ hạng</p><p className="text-3xl font-bold text-purple-600">{currentUserRankData.rank}</p></div>
                        <div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Bài báo đã duyệt</p><p className="text-3xl font-bold text-gray-800">{currentUserRankData.articleCount}</p></div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-600 bg-gray-50 rounded-lg">
                        <p>Bạn chưa có bài báo khoa học nào được duyệt.</p>
                        <Link to="/articles/submit" className="text-sm text-purple-600 font-semibold hover:underline">Đóng góp ngay!</Link>
                    </div>
                )}
            </section>
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Xếp hạng nghiên cứu khoa học</h2>
                {renderTable()}
            </section>
        </div>
    );
};

// --- Main Leaderboard Page Component ---
const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'research'>('weekly');

  const getTabClass = (tabName: 'weekly' | 'research') => {
      const isActive = activeTab === tabName;
      const baseClass = "flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors";
      if (isActive) {
          return `${baseClass} border-b-2 border-blue-600 text-blue-600`;
      }
      return `${baseClass} text-gray-500 hover:text-gray-700`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
        <section className="text-center">
            <Icon name="trophy" className="w-20 h-20 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Bảng xếp hạng</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Vinh danh những thành viên xuất sắc trong thử thách tuần và đóng góp nghiên cứu khoa học.
            </p>
        </section>

        <div className="bg-white rounded-2xl shadow-lg">
            <div className="border-b border-gray-200">
                 <div className="flex space-x-4 sm:space-x-8 px-4">
                    <button onClick={() => setActiveTab('weekly')} className={getTabClass('weekly')}>
                        <Icon name="flame" className="w-5 h-5" />
                        Thử thách hàng tuần
                    </button>
                    <button onClick={() => setActiveTab('research')} className={getTabClass('research')}>
                        <Icon name="beaker" className="w-5 h-5" />
                        Nghiên cứu khoa học
                    </button>
                </div>
            </div>
            <div className="p-4 sm:p-6">
                {activeTab === 'weekly' && <WeeklyLeaderboardTab />}
                {activeTab === 'research' && <ResearchLeaderboardTab />}
            </div>
        </div>
    </div>
  );
};

export default Leaderboard;
