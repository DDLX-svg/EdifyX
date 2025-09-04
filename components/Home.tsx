import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './shared/Icon.tsx';
import Reviews from './Reviews.tsx';
import type { Badge } from '../types.ts';

const Home: React.FC = () => {
  const stats = [
    { value: '1,500+', label: 'Câu hỏi luyện tập', icon: 'trophy' },
    { value: '24/7', label: 'Học tập mọi lúc', icon: 'clock' },
    { value: '95%', label: 'Tỷ lệ đậu cao', icon: 'checkmark' },
  ];

  const modules = [
    {
      title: 'Tài liệu Y khoa',
      description: 'Kho tàng tài liệu y khoa phong phú với hàng nghìn bài giảng, sách tham khảo và nghiên cứu.',
      features: ['Tài liệu chất lượng cao', 'Tìm kiếm nâng cao', 'Chia sẻ dễ dàng'],
      path: '/documents',
      color: 'blue',
      icon: 'book',
    },
    {
      title: 'Luyện tập tổng hợp',
      description: 'Kiểm tra kiến thức toàn diện qua các bài thi chạy trạm giải phẫu, dược học và y đa khoa.',
      features: ['Mô phỏng thi trạm', 'Đa dạng chuyên khoa', 'Phân tích kết quả'],
      path: '/practice',
      color: 'green',
      icon: 'practice',
    },
     {
      title: 'Nghiên cứu khoa học',
      description: 'Khám phá, chia sẻ và thảo luận về các công trình nghiên cứu khoa học trong cộng đồng EdifyX.',
      features: ['Đăng tải công trình', 'Bình duyệt bởi cộng đồng', 'Truy cập mở'],
      path: '/articles',
      color: 'purple',
      icon: 'academic-cap',
    },
    {
      title: 'Ôn thi THPT',
      description: 'Tài liệu, đề thi thử và các bài giảng chất lượng cao giúp học sinh chinh phục kỳ thi Tốt nghiệp THPT Quốc gia.',
      features: ['Đề thi thử mới nhất', 'Bài giảng theo chuyên đề', 'Mẹo làm bài thi'],
      path: '/practice',
      color: 'orange',
      icon: 'rocket',
    },
  ];

  const colorClasses = {
    blue: { bg: 'bg-gradient-to-br from-blue-500 to-cyan-500', button: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    green: { bg: 'bg-gradient-to-br from-green-500 to-emerald-500', button: 'bg-gradient-to-r from-green-500 to-teal-500' },
    purple: { bg: 'bg-gradient-to-br from-purple-500 to-indigo-500', button: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    orange: { bg: 'bg-gradient-to-br from-orange-500 to-amber-500', button: 'bg-gradient-to-r from-orange-500 to-amber-500' },
  };

  const teamMembers = [
    { name: 'Đinh Bảo Đức', role: 'Founder / Developer' },
    { name: 'Nguyễn Minh Anh', role: 'Co-Founder' },
    { name: 'Lê Thu Trang', role: 'Kiểm duyệt viên' },
    { name: 'Trần Văn Hoàng', role: 'Cộng tác viên' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative text-center bg-gray-900 rounded-3xl py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 opacity-90"></div>
        <div 
            className="absolute inset-0 bg-repeat opacity-5"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}
        ></div>
        <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight shadow-text">
            Chinh phục Tri thức cùng EdifyX
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Nền tảng học tập hàng đầu với hệ thống luyện thi và chia sẻ tài liệu chuyên nghiệp
            </p>
            <Link
            to="/practice"
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-2xl group"
            >
            Bắt đầu luyện tập <Icon name="arrowRight" className="inline-block w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center -mt-36 relative z-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-xl group hover:shadow-2xl transition-shadow duration-300">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100 mb-4 transition-transform duration-300 group-hover:scale-110">
              <Icon name={stat.icon} className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>
      
      {/* Modules Section */}
      <section className="pt-12">
        <h2 className="text-4xl font-bold text-center mb-4">Khám phá các module học tập</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Hệ thống học tập toàn diện được thiết kế đặc biệt cho mọi cấp độ học viên
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((mod) => (
            <div key={mod.title} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className={`p-8 text-white ${colorClasses[mod.color as keyof typeof colorClasses].bg}`}>
                 <Icon name={mod.icon} className="w-12 h-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold">{mod.title}</h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <p className="text-gray-600 mb-6 flex-grow">{mod.description}</p>
                <ul className="space-y-3 mb-8">
                  {mod.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Icon name="check-circle" className="w-6 h-6 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={mod.path}
                  className={`mt-auto text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-300 hover:opacity-90 shadow-lg flex items-center justify-center group ${colorClasses[mod.color as keyof typeof colorClasses].button}`}
                >
                  Khám phá ngay <Icon name="arrowRight" className="inline-block w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guide Link Section */}
      <section className="rounded-3xl p-12 bg-slate-100 text-center">
        <Icon name="help" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-4xl font-bold mb-3">Hướng dẫn sử dụng</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Tìm hiểu cách tận dụng tối đa các tính năng học tập và nghiên cứu của EdifyX.
        </p>
        <Link 
            to="/guide"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg group inline-flex items-center"
        >
            Xem hướng dẫn chi tiết
            <Icon name="arrowRight" className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Reviews Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto text-center">
            <Icon name="megaphone" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-4xl font-bold mb-3 text-gray-800">Cộng đồng nói gì về EdifyX</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Những chia sẻ và đánh giá chân thực từ các học viên, bác sĩ và nhà nghiên cứu đã tin tưởng sử dụng nền tảng của chúng tôi.
            </p>
            <Reviews />
        </div>
      </section>

      {/* About Us Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto text-center">
          <Icon name="users" className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-4xl font-bold mb-3 text-gray-800">Gặp gỡ đội ngũ của chúng tôi</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Những con người tâm huyết đứng sau EdifyX, luôn nỗ lực mang đến nền tảng học tập và nghiên cứu tốt nhất.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-2xl shadow-lg text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                  <Icon name="user" className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       <style>{`
        .shadow-text {
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
       `}</style>
    </div>
  );
};

export default Home;