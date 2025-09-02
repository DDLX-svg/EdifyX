import React from 'react';
import { Icon } from './shared/Icon';
import type { Badge } from '../types';

const BadgeInfoCard: React.FC<{ badge: Badge }> = ({ badge }) => {
    // Convert Tailwind color to a hex value for the border
    const colorMap: {[key: string]: string} = {
        'bg-gray-800': '#1F2937', 'bg-red-600': '#DC2626', 'bg-amber-500': '#F59E0B',
        'bg-purple-600': '#9333EA', 'bg-blue-500': '#3B82F6', 'bg-teal-500': '#14B8A6',
        'bg-green-500': '#22C55E', 'bg-indigo-600': '#4F46E5', 'bg-sky-500': '#0EA5E9',
        'bg-orange-500': '#F97316', 'bg-rose-500': '#F43F5E', 'bg-violet-600': '#7C3AED',
        'bg-slate-700': '#334155', 'bg-cyan-600': '#0891B2'
    };
    const borderColor = colorMap[badge.color] || badge.color;

    return (
        <div className="bg-white p-4 rounded-xl flex items-center gap-4 border-l-4 shadow-sm" style={{ borderColor }}>
             <div className={`p-3 rounded-full ${badge.color} flex-shrink-0`}>
                <Icon name={badge.icon} className="w-7 h-7 text-white" />
            </div>
            <div>
                <p className="text-lg font-bold text-gray-800">{badge.name}</p>
                <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
            </div>
        </div>
    );
};

const Guide: React.FC = () => {

    const practiceBadges: Badge[] = [
        { name: 'Tân Binh', description: 'Bắt đầu hành trình chinh phục kiến thức.', icon: 'user', color: 'bg-green-500' },
        { name: 'Học Viên Chăm Chỉ', description: 'Hoàn thành 50 câu hỏi đầu tiên.', icon: 'academic-cap', color: 'bg-teal-500' },
        { name: 'Chiến Binh Tri Thức', description: 'Đã hoàn thành hơn 200 câu hỏi.', icon: 'practice', color: 'bg-blue-500' },
        { name: 'Lão Làng SuniMed', description: 'Đã chinh phục hơn 500 câu hỏi trên hệ thống.', icon: 'trophy', color: 'bg-purple-600' },
        { name: 'Huyền Thoại Sống', description: 'Đã chinh phục hơn 1000 câu hỏi trên hệ thống.', icon: 'trophy-solid', color: 'bg-violet-600' },
        { name: 'Bậc Thầy Chính Xác', description: 'Đạt độ chính xác trên 95% với hơn 50 câu hỏi.', icon: 'star', color: 'bg-amber-500' },
        { name: 'Siêu Chính Xác', description: 'Đạt độ chính xác trên 98% với hơn 200 câu hỏi.', icon: 'target', color: 'bg-rose-500' },
    ];
    
    const researchBadges: Badge[] = [
        { name: 'Nhà Nghiên cứu', description: 'Có bài báo khoa học đầu tiên được phê duyệt.', icon: 'document', color: 'bg-orange-500' },
        { name: 'Học Giả', description: 'Đóng góp 5+ công trình nghiên cứu cho cộng đồng.', icon: 'book', color: 'bg-sky-500' },
        { name: 'Tiến Sĩ', description: 'Đóng góp 10+ công trình nghiên cứu khoa học.', icon: 'beaker', color: 'bg-indigo-600' },
        { name: 'Giáo Sư', description: 'Đóng góp 20+ công trình nghiên cứu khoa học.', icon: 'academic-cap-solid', color: 'bg-cyan-600' },
        { name: 'Nhà Khoa Học Tiên Phong', description: 'Đóng góp 50+ công trình nghiên cứu khoa học.', icon: 'rocket', color: 'bg-slate-700' },
    ];

    const specialBadges: Badge[] = [
        { name: 'Quản trị viên', description: 'Quản lý và duy trì nội dung của SuniMed.', icon: 'admin', color: 'bg-red-600' },
        { name: 'Developer', description: 'Người xây dựng và phát triển hệ thống SuniMed.', icon: 'settings', color: 'bg-gray-800' },
    ];
    
    const resources = [
        { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
        { name: 'ACS Publications', url: 'https://pubs.acs.org/' },
        { name: 'New England Journal of Medicine (NEJM)', url: 'https://www.nejm.org/' },
        { name: 'The Lancet', url: 'https://www.thelancet.com/' },
        { name: 'Nature Medicine', url: 'https://www.nature.com/nm/' },
        { name: 'Google Scholar', url: 'https://scholar.google.com/' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center">
                <Icon name="help" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Chào mừng đến với SuniMed</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Đây là trang hướng dẫn toàn diện giúp bạn tận dụng tối đa các tính năng của nền tảng.
                </p>
            </section>

            <section id="usage-guide" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Hướng dẫn sử dụng</h2>
                <div className="space-y-4 text-gray-700">
                    <p>SuniMed được thiết kế để trở thành người bạn đồng hành trong học tập và nghiên cứu y khoa. Dưới đây là các tính năng chính:</p>
                    <ul className="list-disc list-inside space-y-3 pl-4">
                        <li><strong className="font-semibold">Tài liệu:</strong> Truy cập kho tài liệu y khoa phong phú, từ sách, bài giảng đến video. Sử dụng bộ lọc để tìm kiếm nhanh chóng và chính xác.</li>
                        <li><strong className="font-semibold">Nghiên cứu:</strong> Khám phá các công trình nghiên cứu từ cộng đồng, chia sẻ kiến thức và đăng tải bài báo của riêng bạn để đóng góp cho nền y học.</li>
                        <li><strong className="font-semibold">Luyện tập:</strong> Củng cố kiến thức qua ba chế độ: Thi chạy trạm Giải phẫu, trắc nghiệm Dược học và Y đa khoa.</li>
                        <li><strong className="font-semibold">Bảng xếp hạng:</strong> Theo dõi thành tích của bạn và cạnh tranh với các thành viên khác trong các thử thách tuần và xếp hạng nghiên cứu.</li>
                        <li><strong className="font-semibold">Hồ sơ cá nhân:</strong> Quản lý thông tin, xem lại các thành tích, huy hiệu đã đạt được và theo dõi trạng thái các bài báo đã đăng.</li>
                    </ul>
                </div>
            </section>
            
             <section id="contribution-guide" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">2. Hướng dẫn đóng góp</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">Đăng tải bài viết nghiên cứu</h3>
                        <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-700">
                            <li>Truy cập mục <strong className="font-semibold">Nghiên cứu</strong> từ thanh điều hướng.</li>
                            <li>Nhấn vào nút <strong className="font-semibold">"Đăng bài báo"</strong>.</li>
                            <li>Điền đầy đủ các thông tin được yêu cầu: Tiêu đề, Tác giả, Tóm tắt, Từ khóa,...</li>
                            <li>Cung cấp một liên kết URL hợp lệ đến tài liệu PDF toàn văn (ví dụ: Google Drive, Dropbox).</li>
                            <li>Sau khi gửi, bài viết của bạn sẽ được đội ngũ quản trị viên xem xét. Bạn có thể theo dõi trạng thái bài viết trong trang Hồ sơ cá nhân.</li>
                        </ol>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Gửi tài liệu hỗ trợ cộng đồng</h3>
                         <p className="text-gray-700">Thư viện tài liệu của chúng tôi luôn chào đón sự đóng góp từ bạn. Để đảm bảo chất lượng, các tài liệu sẽ được quản trị viên kiểm duyệt trước khi đăng tải.</p>
                        <ul className="list-disc list-inside space-y-2 pl-4 mt-2 text-gray-700">
                            <li>Soạn một email mới và gửi đến địa chỉ: <strong className="font-semibold select-all">bduc6974@gmail.com</strong>.</li>
                            <li>Đính kèm tệp tài liệu của bạn (sách, bài giảng, video,...).</li>
                            <li>Trong email, vui lòng ghi rõ <strong className="font-semibold">Tiêu đề, Tác giả, và Danh mục</strong> (nếu có) của tài liệu.</li>
                            <li>Đội ngũ SuniMed sẽ xem xét và đăng tải tài liệu của bạn trong thời gian sớm nhất.</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <section id="badges" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">3. Hệ thống Huy hiệu</h2>
                <p className="text-gray-700 mb-6">Huy hiệu là sự ghi nhận cho những nỗ lực và đóng góp của bạn cho cộng đồng SuniMed. Hãy cố gắng sưu tầm tất cả nhé!</p>
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Luyện tập</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {practiceBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
                 <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Nghiên cứu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {researchBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Đặc biệt</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specialBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
            </section>

             <section id="resources" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">4. Tài nguyên tham khảo</h2>
                 <p className="text-gray-700 mb-4">SuniMed tham khảo và khuyến khích sử dụng các nguồn tài liệu y khoa uy tín sau đây cho việc học tập và nghiên cứu:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    {resources.map(res => (
                        <li key={res.name}>
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                                {res.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    );
};

export default Guide;
