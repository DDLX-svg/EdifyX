
import React from 'react';
import { Icon } from './shared/Icon.tsx';
import type { Badge } from '../types.ts';

const BadgeInfoCard: React.FC<{ badge: Badge }> = ({ badge }) => {
    // Convert Tailwind color to a hex value for the border
    const colorMap: {[key: string]: string} = {
        'bg-gray-800': '#1F2937', 'bg-red-600': '#DC2626', 'bg-amber-500': '#F59E0B',
        'bg-purple-600': '#9333EA', 'bg-blue-500': '#3B82F6', 'bg-teal-500': '#14B8A6',
        'bg-green-500': '#22C55E', 'bg-indigo-600': '#4F46E5', 'bg-sky-500': '#0EA5E9',
        'bg-orange-500': '#F97316', 'bg-rose-500': '#F43F5E', 'bg-violet-600': '#7C3AED',
        'bg-slate-700': '#334155', 'bg-cyan-600': '#0891B2', 'bg-pink-500': '#EC4899', 
        'bg-fuchsia-600': '#C026D3', 'bg-lime-600': '#65A30D', 'bg-red-700': '#B91C1C'
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
        { name: 'Tân Binh', description: 'Bắt đầu hành trình chinh phục kiến thức.', icon: 'backpack', color: 'bg-green-500' },
        { name: 'Học Viên Chăm Chỉ', description: 'Hoàn thành 50 câu hỏi đầu tiên.', icon: 'book', color: 'bg-teal-500' },
        { name: 'Chiến Binh Tri Thức', description: 'Đã hoàn thành hơn 200 câu hỏi.', icon: 'swords', color: 'bg-blue-500' },
        { name: 'Lão Làng SuniMed', description: 'Đã chinh phục hơn 500 câu hỏi trên hệ thống.', icon: 'building', color: 'bg-purple-600' },
        { name: 'Huyền Thoại Sống', description: 'Đã chinh phục hơn 1000 câu hỏi trên hệ thống.', icon: 'crown', color: 'bg-violet-600' },
        { name: 'Bậc Thầy Chính Xác', description: 'Đạt độ chính xác trên 95% với hơn 50 câu hỏi.', icon: 'target', color: 'bg-amber-500' },
        { name: 'Siêu Chính Xác', description: 'Đạt độ chính xác trên 98% với hơn 200 câu hỏi.', icon: 'sparkles', color: 'bg-rose-500' },
    ];
    
    const researchBadges: Badge[] = [
        { name: 'Nhà Nghiên cứu', description: 'Có bài báo khoa học đầu tiên được phê duyệt (>=1).', icon: 'microscope', color: 'bg-orange-500' },
        { name: 'Học Giả', description: 'Đóng góp 5+ công trình nghiên cứu cho cộng đồng.', icon: 'scroll', color: 'bg-blue-500' },
        { name: 'Thạc sĩ', description: 'Đóng góp 10+ công trình nghiên cứu khoa học.', icon: 'academic-cap', color: 'bg-sky-500' },
        { name: 'Tiến sĩ', description: 'Đóng góp 25+ công trình nghiên cứu khoa học.', icon: 'trophy', color: 'bg-cyan-600' },
        { name: 'Nhà Khoa học Chuyên nghiệp', description: 'Đóng góp 50+ công trình nghiên cứu khoa học.', icon: 'beaker', color: 'bg-indigo-600' },
        { name: 'Phó giáo sư', description: 'Đóng góp 75+ công trình nghiên cứu khoa học.', icon: 'trophy', color: 'bg-purple-600' },
        { name: 'Giáo sư', description: 'Đóng góp 100+ công trình nghiên cứu khoa học.', icon: 'trophy-solid', color: 'bg-fuchsia-600' },
        { name: 'Nhà bác học', description: 'Đóng góp 150+ công trình nghiên cứu.', icon: 'brain', color: 'bg-slate-700' },
        { name: 'Siêu thiên tài', description: 'Đóng góp 250+ công trình nghiên cứu.', icon: 'galaxy', color: 'bg-red-700' },
    ];

    const specialBadges: Badge[] = [
        { name: 'Cộng tác viên', description: 'Thành viên tích cực đóng góp tài liệu chất lượng cho cộng đồng.', icon: 'handshake', color: 'bg-pink-500' },
        { name: 'Đại sứ SuniMed', description: 'Người đại diện cho giá trị và tinh thần của cộng đồng SuniMed.', icon: 'globe', color: 'bg-fuchsia-600' },
        { name: 'Bác sĩ chuyên ngành', description: 'Chuyên gia y khoa với kiến thức và kinh nghiệm sâu rộng.', icon: 'stethoscope', color: 'bg-cyan-600' },
        { name: 'Dược sĩ chuyên ngành', description: 'Chuyên gia về dược phẩm, đảm bảo sử dụng thuốc an toàn.', icon: 'pill', color: 'bg-lime-600' },
        { name: 'Nhà khoa học trẻ', description: 'Tài năng trẻ có đóng góp và tiềm năng nghiên cứu.', icon: 'beaker', color: 'bg-teal-500' },
        { name: 'Quản trị viên', description: 'Quản lý và duy trì nội dung của SuniMed.', icon: 'shield', color: 'bg-red-600' },
        { name: 'Developer', description: 'Người xây dựng và phát triển hệ thống SuniMed.', icon: 'laptop', color: 'bg-gray-800' },
    ];
    
    const resources = [
        { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
        { name: 'ACS Publications', url: 'https://pubs.acs.org/' },
        { name: 'New England Journal of Medicine (NEJM)', url: 'https://www.nejm.org/' },
        { name: 'The Lancet', url: 'https://www.thelancet.com/' },
        { name: 'Nature Medicine', url: 'https://www.nature.com/nm/' },
        { name: 'Google Scholar', url: 'https://scholar.google.com/' },
    ];
    
    const writingGuideSections = [
      {
        icon: 'document',
        title: 'Báo cáo Nghiên cứu gốc (Original Research)',
        content: 'Trình bày các phát hiện từ một nghiên cứu gốc do chính tác giả thực hiện. Cấu trúc IMRaD là tiêu chuẩn vàng:',
        points: [
            '**Giới thiệu (Introduction):** Bắt đầu từ bối cảnh rộng, thu hẹp dần đến vấn đề cụ thể, nêu rõ lỗ hổng kiến thức và kết thúc bằng câu hỏi hoặc giả thuyết nghiên cứu rõ ràng.',
            '**Phương pháp (Methods):** Mô tả chi tiết thiết kế nghiên cứu (RCT, đoàn hệ, bệnh-chứng,...), đối tượng tham gia, tiêu chí chọn mẫu và loại trừ, quy trình thu thập dữ liệu, các biến số được đo lường, và các phương pháp phân tích thống kê đã sử dụng. Mục tiêu là cho phép người khác có thể tái lập nghiên cứu.',
            '**Kết quả (Results):** Trình bày các dữ liệu thu thập được một cách khách quan, không diễn giải. Bắt đầu bằng mô tả mẫu nghiên cứu, sau đó là các kết quả chính. Sử dụng bảng và biểu đồ để minh họa, nhưng không lặp lại thông tin.',
            '**Bàn luận (Discussion):** Diễn giải ý nghĩa của kết quả. So sánh phát hiện của bạn với các nghiên cứu trước đó. Thảo luận về điểm mạnh và hạn chế của nghiên cứu. Nêu ra các hàm ý cho thực hành lâm sàng hoặc nghiên cứu trong tương lai và kết thúc bằng một kết luận súc tích.',
        ]
      },
      {
        icon: 'book',
        title: 'Bài báo Tổng quan (Review Article)',
        content: 'Tổng hợp và phân tích các tài liệu đã có về một chủ đề nhất định. Có hai loại chính: tổng quan tường thuật (narrative) và tổng quan hệ thống (systematic).',
        points: [
            '**Xác định câu hỏi:** Câu hỏi nghiên cứu phải rõ ràng và cụ thể (ví dụ, theo mô hình PICO cho các câu hỏi lâm sàng).',
            '**Chiến lược tìm kiếm:** Mô tả các cơ sở dữ liệu (PubMed, Scopus), từ khóa và chiến lược đã sử dụng để tìm kiếm tài liệu một cách toàn diện.',
            '**Sàng lọc và đánh giá:** Nêu rõ các tiêu chí lựa chọn và loại trừ bài báo. Đối với tổng quan hệ thống, cần đánh giá chất lượng (nguy cơ sai lệch) của các nghiên cứu được đưa vào.',
            '**Tổng hợp dữ liệu:** Trình bày và tổng hợp các kết quả từ các nghiên cứu đã chọn. Nếu có thể (trong một meta-analysis), kết hợp dữ liệu thống kê để có một ước tính tổng hợp.',
        ]
      },
      {
        icon: 'stethoscope',
        title: 'Báo cáo Ca lâm sàng (Case Report)',
        content: 'Mô tả chi tiết về một trường hợp lâm sàng độc đáo, hiếm gặp, hoặc mang lại một bài học quan trọng. Cần tuân thủ các hướng dẫn như CARE.',
        points: [
             '**Sự đồng ý của bệnh nhân:** Đây là yêu cầu bắt buộc. Phải có được sự đồng ý của bệnh nhân để công bố thông tin (sau khi đã ẩn danh).',
             '**Cấu trúc:** Thường bao gồm Tóm tắt, Giới thiệu về bệnh lý, Trình bày ca bệnh (thông tin nhân khẩu, bệnh sử, khám lâm sàng, cận lâm sàng, chẩn đoán, điều trị và diễn tiến), Bàn luận về các khía cạnh độc đáo, và Kết luận.',
             '**Tính mới lạ:** Nhấn mạnh điểm độc đáo của ca bệnh - tại sao nó đáng được báo cáo?',
        ]
      },
      {
        icon: 'practice',
        title: 'Trình bày số liệu và Thống kê',
        content: 'Việc trình bày dữ liệu một cách trực quan và chính xác là cực kỳ quan trọng.',
        points: [
            '**Chọn biểu đồ phù hợp:** Dùng biểu đồ cột (bar chart) để so sánh các nhóm, biểu đồ đường (line chart) cho dữ liệu theo thời gian, biểu đồ hộp (box plot) để thể hiện phân phối, biểu đồ phân tán (scatter plot) cho mối tương quan.',
            '**Chú thích rõ ràng:** Mỗi bảng và hình phải có tiêu đề mô tả ngắn gọn nội dung và các chú thích cần thiết để người đọc hiểu được mà không cần đọc lại toàn bộ văn bản.',
            '**Báo cáo thống kê:** Khi báo cáo kết quả từ các phép kiểm định (t-test, ANOVA, chi-square), luôn nêu rõ giá trị p, và nếu có thể là khoảng tin cậy (95% CI) và kích thước ảnh hưởng (effect size).',
            '**Mô tả phương pháp:** Trong phần Phương pháp, phải nêu rõ các phần mềm và các phép kiểm định thống kê nào đã được sử dụng.',
        ]
      },
       {
        icon: 'users',
        title: 'Nghiên cứu Khảo sát (Survey Research)',
        content: 'Thu thập dữ liệu thông qua bảng câu hỏi để mô tả đặc điểm, thái độ hoặc hành vi của một nhóm đối tượng.',
        points: [
            '**Phát triển bộ câu hỏi:** Thiết kế các câu hỏi rõ ràng, đơn nghĩa, không định hướng. Sử dụng các thang đo đã được kiểm định (validated scales) nếu có. Nên thực hiện một nghiên cứu thí điểm (pilot test) để kiểm tra bộ câu hỏi trước khi triển khai chính thức.',
            '**Phương pháp chọn mẫu:** Mô tả rõ quần thể mục tiêu và cách chọn mẫu (ví dụ: ngẫu nhiên đơn, phân tầng, cụm, hoặc phi xác suất như thuận tiện, chủ đích). Kích thước mẫu và cách tính toán cũng cần được nêu rõ.',
            '**Quy trình thu thập dữ liệu:** Mô tả cách thức khảo sát được thực hiện (trực tuyến, qua điện thoại, trực tiếp). Báo cáo tỷ lệ phản hồi.',
            '**Đạo đức nghiên cứu:** Phải có sự chấp thuận của hội đồng y đức (IRB). Người tham gia phải được cung cấp thông tin đầy đủ và đưa ra sự đồng ý tự nguyện (informed consent). Dữ liệu phải được ẩn danh và bảo mật.',
        ]
      },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center">
                <Icon name="compass" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Chào mừng đến với SuniMed</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Đây là trang hướng dẫn toàn diện giúp bạn tận dụng tối đa các tính năng của nền tảng.
                </p>
            </section>
            
            <section id="usage-guide" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="logo" className="w-8 h-8 text-blue-600" />1. Hướng dẫn sử dụng</h2>
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
            
            <section id="writing-guide" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="edit" className="w-8 h-8 text-green-600" />2. Hướng dẫn Viết & Đóng góp</h2>
                
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mb-8">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">Nguyên tắc chung khi viết khoa học</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-blue-700">
                      <div className="flex items-start gap-3"><Icon name="check-circle" className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" /><span>**Rõ ràng & Ngắn gọn:** Diễn đạt ý tưởng một cách trực tiếp, tránh thuật ngữ phức tạp không cần thiết.</span></div>
                      <div className="flex items-start gap-3"><Icon name="check-circle" className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" /><span>**Khách quan:** Trình bày dữ liệu và sự thật, tránh đưa ra ý kiến cá nhân hoặc những nhận định cảm tính.</span></div>
                      <div className="flex items-start gap-3"><Icon name="check-circle" className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" /><span>**Trích dẫn nguồn:** Luôn ghi nhận công trình của người khác bằng cách trích dẫn đầy đủ và nhất quán.</span></div>
                      <div className="flex items-start gap-3"><Icon name="check-circle" className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" /><span>**Đạo đức:** Đảm bảo tính trung thực trong nghiên cứu, tôn trọng đối tượng nghiên cứu và tránh đạo văn.</span></div>
                  </div>
                </div>

                <div className="space-y-6">
                    {writingGuideSections.map(section => (
                        <div key={section.title} className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3"><Icon name={section.icon} className="w-6 h-6 text-gray-600" />{section.title}</h3>
                            <p className="text-gray-700 mb-3">{section.content}</p>
                            <ul className="space-y-2 pl-5">
                                {section.points.map(point => (
                                    <li key={point} className="flex items-start gap-3 text-gray-600">
                                        <Icon name="arrowRight" className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-700">$1</strong>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                 <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cách thức nộp bài</h3>
                     <div className="space-y-4 text-gray-700">
                        <p>Để đóng góp cho cộng đồng, bạn có thể:</p>
                        <ul className="list-disc list-inside space-y-3 pl-4">
                            <li><strong className="font-semibold">Đăng tải bài viết nghiên cứu:</strong> Truy cập mục <strong className="font-semibold">Nghiên cứu</strong>, nhấn nút "Đăng bài báo", và điền vào biểu mẫu. Bài viết của bạn sẽ được đội ngũ quản trị viên xem xét.</li>
                             <li><strong className="font-semibold">Gửi tài liệu hỗ trợ cộng đồng:</strong> Soạn email gửi đến <strong className="font-semibold select-all">bduc6974@gmail.com</strong>, đính kèm tệp và ghi rõ thông tin (Tiêu đề, Tác giả, Danh mục).</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <section id="badges" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="medal" className="w-8 h-8 text-amber-500" />3. Hệ thống Huy hiệu</h2>
                <p className="text-gray-700 mb-6">Huy hiệu là sự ghi nhận cho những nỗ lực và đóng góp của bạn cho cộng đồng SuniMed. Hãy cố gắng sưu tầm tất cả nhé!</p>
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Luyện tập (dựa trên thành tích)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {practiceBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
                 <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Nghiên cứu (dựa trên số bài báo được duyệt)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {researchBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh hiệu Đặc biệt (do Admin trao tặng)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specialBadges.map(badge => <BadgeInfoCard key={badge.name} badge={badge} />)}
                    </div>
                </div>
            </section>

             <section id="resources" className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="book" className="w-8 h-8 text-indigo-600" />4. Tài nguyên tham khảo</h2>
                 <p className="text-gray-700 mb-4">SuniMed tham khảo và khuyến khích sử dụng các nguồn tài liệu y khoa uy tín sau đây cho việc học tập và nghiên cứu:</p>
                <ul className="list-disc list-inside space-y-2 pl-4 columns-1 md:columns-2">
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
