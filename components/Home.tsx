
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './shared/Icon';
import type { Badge } from '../types';

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
      description: 'Khám phá, chia sẻ và thảo luận về các công trình nghiên cứu khoa học trong cộng đồng SuniMed.',
      features: ['Đăng tải công trình', 'Bình duyệt bởi cộng đồng', 'Truy cập mở'],
      path: '/articles',
      color: 'purple',
      icon: 'academic-cap',
    },
  ];

  const colorClasses = {
    blue: { bg: 'bg-gradient-to-br from-blue-500 to-cyan-500', button: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    green: { bg: 'bg-gradient-to-br from-green-500 to-emerald-500', button: 'bg-gradient-to-r from-green-500 to-teal-500' },
    purple: { bg: 'bg-gradient-to-br from-purple-500 to-indigo-500', button: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  };

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
            Chinh phục Y khoa cùng SuniMed
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Nền tảng học tập y khoa hàng đầu với hệ thống luyện thi và chia sẻ tài liệu chuyên nghiệp
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
          Hệ thống học tập toàn diện được thiết kế đặc biệt cho sinh viên và bác sĩ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            Tìm hiểu cách tận dụng tối đa các tính năng học tập và nghiên cứu của SuniMed.
        </p>
        <Link 
            to="/guide"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg group inline-flex items-center"
        >
            Xem hướng dẫn chi tiết
            <Icon name="arrowRight" className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Feedback Section */}
      <section className="rounded-3xl p-12 bg-gray-800 text-white text-center">
        <Icon name="feedback" className="w-16 h-16 mx-auto text-blue-400 mb-4" />
        <h2 className="text-4xl font-bold mb-3">Góp ý & Báo lỗi</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Sự đóng góp của bạn giúp chúng tôi hoàn thiện SuniMed hơn mỗi ngày.
        </p>
        <a 
          href="https://forms.gle/your-feedback-form-link"
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg inline-block group"
        >
          Gửi góp ý
        </a>
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
