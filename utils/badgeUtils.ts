import type { Account, ScientificArticle, Badge } from '../types.ts';

// Central source of truth for all badge properties
export const BADGE_DEFINITIONS: { [key: string]: Omit<Badge, 'name'> } = {
    // Special Badges (from sheets)
    'Developer': { description: 'Người xây dựng và phát triển hệ thống EdifyX.', icon: 'laptop', color: 'bg-gray-800' },
    'Admin': { description: 'Quản lý và duy trì nội dung của EdifyX.', icon: 'shield', color: 'bg-red-600' },
    'Bác sĩ chuyên ngành': { description: 'Chuyên gia y khoa với kiến thức và kinh nghiệm sâu rộng trong một lĩnh vực cụ thể.', icon: 'stethoscope', color: 'bg-cyan-600' },
    'Dược sĩ chuyên ngành': { description: 'Chuyên gia về dược phẩm, đảm bảo việc sử dụng thuốc an toàn và hiệu quả.', icon: 'pill', color: 'bg-lime-600' },
    'Nhà khoa học trẻ': { description: 'Một tài năng trẻ có nhiều đóng góp và tiềm năng trong lĩnh vực nghiên cứu khoa học.', icon: 'beaker', color: 'bg-teal-500' },
    'Cộng tác viên': { description: 'Dành cho những thành viên tích cực đóng góp tài liệu chất lượng cho cộng đồng.', icon: 'handshake', color: 'bg-pink-500' },
    'Đại sứ EdifyX': { description: 'Người đại diện cho giá trị và tinh thần của cộng đồng EdifyX.', icon: 'globe', color: 'bg-fuchsia-600' },

    // Calculated Practice Badges
    'Tân Binh': { description: 'Bắt đầu hành trình chinh phục kiến thức.', icon: 'backpack', color: 'bg-green-500' },
    'Học Viên Chăm Chỉ': { description: 'Hoàn thành 50 câu hỏi đầu tiên.', icon: 'book', color: 'bg-teal-500' },
    'Chiến Binh Tri Thức': { description: 'Đã hoàn thành hơn 200 câu hỏi.', icon: 'swords', color: 'bg-blue-500' },
    'Lão Làng EdifyX': { description: 'Đã chinh phục hơn 500 câu hỏi trên hệ thống.', icon: 'building', color: 'bg-purple-600' },
    'Huyền Thoại Sống': { description: 'Đã chinh phục hơn 1000 câu hỏi trên hệ thống.', icon: 'crown', color: 'bg-violet-600' },
    'Bậc Thầy Chính Xác': { description: 'Đạt độ chính xác trên 95% với hơn 50 câu hỏi.', icon: 'target', color: 'bg-amber-500' },
    'Siêu Chính Xác': { description: 'Đạt độ chính xác trên 98% với hơn 200 câu hỏi.', icon: 'sparkles', color: 'bg-rose-500' },
    
    // Calculated Research Badges
    'Nhà Nghiên cứu': { description: 'Có bài báo khoa học đầu tiên được phê duyệt.', icon: 'microscope', color: 'bg-orange-500' },
    'Học Giả': { description: 'Đóng góp 5+ công trình nghiên cứu cho cộng đồng.', icon: 'scroll', color: 'bg-blue-500' },
    'Thạc sĩ': { description: 'Đóng góp 10+ công trình nghiên cứu khoa học.', icon: 'academic-cap', color: 'bg-sky-500' },
    'Tiến sĩ': { description: 'Đóng góp 25+ công trình nghiên cứu khoa học.', icon: 'trophy', color: 'bg-cyan-600' },
    'Nhà Khoa học Chuyên nghiệp': { description: 'Đóng góp 50+ công trình nghiên cứu khoa học.', icon: 'beaker', color: 'bg-indigo-600' },
    'Phó giáo sư': { description: 'Đóng góp 75+ công trình nghiên cứu khoa học.', icon: 'trophy', color: 'bg-purple-600' },
    'Giáo sư': { description: 'Đóng góp 100+ công trình nghiên cứu khoa học.', icon: 'trophy-solid', color: 'bg-fuchsia-600' },
    'Nhà bác học': { description: 'Đóng góp 150+ công trình nghiên cứu, định hình lại kiến thức y khoa.', icon: 'brain', color: 'bg-slate-700' },
    'Siêu thiên tài': { description: 'Đóng góp 250+ công trình nghiên cứu, một trí tuệ phi thường.', icon: 'galaxy', color: 'bg-red-700' },
};

const getCalculatedPracticeBadgeName = (user: Account): string => {
    const total = user['Tổng số câu hỏi đã làm'] || 0;
    const correct = user['Tổng số câu hỏi đã làm đúng'] || 0;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    if (total > 200 && accuracy >= 98) return 'Siêu Chính Xác';
    if (total > 50 && accuracy >= 95) return 'Bậc Thầy Chính Xác';
    if (total >= 1000) return 'Huyền Thoại Sống';
    if (total >= 500) return 'Lão Làng EdifyX';
    if (total >= 200) return 'Chiến Binh Tri Thức';
    if (total >= 50) return 'Học Viên Chăm Chỉ';
    return 'Tân Binh';
};

const getCalculatedResearchBadgeName = (approvedArticleCount: number): string | null => {
    if (approvedArticleCount >= 250) return 'Siêu thiên tài';
    if (approvedArticleCount >= 150) return 'Nhà bác học';
    if (approvedArticleCount >= 100) return 'Giáo sư';
    if (approvedArticleCount >= 75) return 'Phó giáo sư';
    if (approvedArticleCount >= 50) return 'Nhà Khoa học Chuyên nghiệp';
    if (approvedArticleCount >= 25) return 'Tiến sĩ';
    if (approvedArticleCount >= 10) return 'Thạc sĩ';
    if (approvedArticleCount >= 5) return 'Học Giả';
    if (approvedArticleCount >= 1) return 'Nhà Nghiên cứu';
    return null;
};

// Main function to get all badges for a user
export const getUserBadges = (user: Account, userArticles: ScientificArticle[]): Badge[] => {
    const badges: Badge[] = [];
    const addedNames = new Set<string>();

    const addBadge = (name: string | null, isFromSheet: boolean = false) => {
        if (!name || name.trim() === '' || addedNames.has(name)) {
            return;
        }

        const definition = BADGE_DEFINITIONS[name];
        if (definition) {
            // Predefined badge found
            badges.push({ name, ...definition });
            addedNames.add(name);
        } else if (isFromSheet) {
            // This is a custom badge from the sheet that isn't in our definitions.
            // We create a default, visually appealing badge for it.
            badges.push({
                name,
                description: `Danh hiệu đặc biệt: ${name}`,
                icon: 'sparkles', // A special icon for custom badges
                color: 'bg-fuchsia-600', // A distinct, premium color
            });
            addedNames.add(name);
        }
    };

    // 1. Add assigned badges from the 'Danh hiệu' column
    const danhHieu = user['Danh hiệu'];
    if (danhHieu && danhHieu.toLowerCase() !== 'user' && danhHieu.toLowerCase() !== 'không') {
        addBadge(danhHieu.trim(), true);
    }

    // 2. Add assigned badges from the 'Đặc biệt' column
    const dacBiet = user['Đặc biệt'];
    if (dacBiet && dacBiet.toLowerCase() !== 'không') {
        addBadge(dacBiet.trim(), true);
    }
    
    // 3. Add the calculated practice badge
    const practiceBadgeName = getCalculatedPracticeBadgeName(user);
    addBadge(practiceBadgeName);

    // 4. Add the calculated research badge
    const approvedCount = userArticles.filter(a => a.Status === 'Approved').length;
    const researchBadgeName = getCalculatedResearchBadgeName(approvedCount);
    addBadge(researchBadgeName);

    return badges;
};
