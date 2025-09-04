import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './shared/Icon.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-20">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Icon name="logo" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EdifyX</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Nền tảng học tập tương tác dành cho học sinh, sinh viên và các chuyên gia, cung cấp các công cụ luyện thi, chia sẻ tài liệu và nghiên cứu khoa học.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link to="/documents" className="hover:text-white transition-colors">Tài liệu</Link></li>
              <li><Link to="/practice" className="hover:text-white transition-colors">Luyện tập</Link></li>
              <li><Link to="/articles" className="hover:text-white transition-colors">Nghiên cứu</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Icon name="mail" className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email Ban quản trị</p>
                  <a href="mailto:bduc6974@gmail.com" className="hover:text-white transition-colors break-all">bduc6974@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Mạng xã hội</p>
                  <p className="text-gray-400">Đang cập nhật</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EdifyX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;