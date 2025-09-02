
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './shared/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

const Header: React.FC = () => {
  const { currentUser, logout, newArticleCount, markArticlesAsSeen } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  
  const canAccessAdmin = currentUser && (currentUser['Danh hiệu'] === 'Admin' || currentUser['Danh hiệu'] === 'Developer');

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Icon name="logo" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">SuniMed</span>
            </NavLink>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClass}>
              <Icon name="home" className="w-4 h-4 mr-2" /> Trang chủ
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              <Icon name="document" className="w-4 h-4 mr-2" /> Tài liệu
            </NavLink>
             <NavLink to="/articles" className={navLinkClass} onClick={markArticlesAsSeen}>
              <Icon name="academic-cap" className="w-4 h-4 mr-2" /> Nghiên cứu
              {newArticleCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
              )}
            </NavLink>
             <NavLink to="/publications" className={navLinkClass}>
              <Icon name="star" className="w-4 h-4 mr-2" /> Ấn phẩm
            </NavLink>
            <NavLink to="/practice" className={navLinkClass}>
              <Icon name="practice" className="w-4 h-4 mr-2" /> Luyện tập
            </NavLink>
            <NavLink to="/guide" className={navLinkClass}>
              <Icon name="help" className="w-4 h-4 mr-2" /> Hướng dẫn
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClass}>
              <Icon name="trophy" className="w-4 h-4 mr-2" /> Bảng xếp hạng
            </NavLink>
            {currentUser && (
               <NavLink to={`/profile/${currentUser.Email}`} className={navLinkClass}>
                <Icon name="user" className="w-4 h-4 mr-2" /> Hồ sơ
              </NavLink>
            )}
            {canAccessAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <Icon name="admin" className="w-4 h-4 mr-2" /> Quản trị
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Xin chào, {currentUser['Tên tài khoản']}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;