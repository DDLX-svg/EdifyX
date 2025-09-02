
import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const { resendVerificationEmail } = useAuth();

  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setLoading(true);
    setMessage('');
    setError('');

    const result = await resendVerificationEmail(email);
    
    if (result.success) {
      setMessage('Email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn (bao gồm cả thư mục spam).');
      setCooldown(60);
    } else {
      setError(result.error || 'Gửi lại email thất bại. Vui lòng thử lại.');
    }
    setLoading(false);
  };
  
  if (!email) {
    // If someone lands here without an email from registration, redirect them.
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Xác thực tài khoản của bạn
          </h2>
          <p className="mt-2 text-md text-gray-600">
            Cảm ơn bạn đã đăng ký! Chúng tôi đã gửi một liên kết xác thực đến email:
          </p>
          <p className="font-bold text-gray-800 my-2">{email}</p>
          <p className="text-md text-gray-600">
            Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) và nhấp vào liên kết để hoàn tất quá trình đăng ký.
          </p>
        </div>
        
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}

        <div className="mt-8 space-y-4">
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang gửi...' : (cooldown > 0 ? `Gửi lại sau (${cooldown}s)` : 'Gửi lại email xác thực')}
          </button>
          
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;