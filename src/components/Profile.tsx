
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAccounts, fetchArticles } from '../services/googleSheetService.ts';
import type { Account, ScientificArticle, Badge } from '../types.ts';
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
        <div className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full ${badge.color} cursor-pointer`}>
            <Icon name={badge.icon} className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">{badge.name}</span>
        </div>
        <div role="tooltip" className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10">
            {badge.description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
    </div>
);


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

    const { practiceBadge, researchBadge, mainBadge, allBadges, weeklyStats, totalStats } = useMemo(() => {
        if (!profileUser) {
            // FIX: Provide a default structure for stats objects to prevent type errors when accessing their properties.
            return { practiceBadge: null, researchBadge: null, mainBadge: null, allBadges: [], weeklyStats: { attempted: 0, correct: 0, accuracy: 0 }, totalStats: { attempted: 0, correct: 0, accuracy: 0 } };
        }

        const practice = getPracticeBadge(profileUser);
        const approvedCount = userArticles.filter(art => art.Status === 'Approved').length;
        const research = getResearchBadge(approvedCount);
        
        const main = research || practice;
        const badges = [research, practice].filter(Boolean) as Badge[];

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

        return { practiceBadge: practice, researchBadge: research, mainBadge: main, allBadges: badges, weeklyStats: weekly, totalStats: total };
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
                    <div className="flex gap-2 justify-center md:justify-start mt-2">
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
