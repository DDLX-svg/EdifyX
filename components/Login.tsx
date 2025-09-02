import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './shared/Icon';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'credentials' | 'unverified' | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) {
        setError('');
        setErrorType(null);
        setUnverifiedEmail(null);
    }
  };

  const handleGoToVerify = () => {
    if (unverifiedEmail) {
      navigate('/verify-email', { state: { email: unverifiedEmail } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorType(null);
    setUnverifiedEmail(null);
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Đăng nhập thất bại.');
      if (result.reason === 'unverified' && result.email) {
        setErrorType('unverified');
        setUnverifiedEmail(result.email);
      } else {
        setErrorType('credentials');
      }
    }
  };

  const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const inputDefaultClasses = "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const baseInputClasses = "appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm";

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-400">
             <Icon name="logo" className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào SuniMed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              tạo tài khoản mới
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
              <div className="flex">
                  <div className="py-1"><Icon name="alert" className="h-5 w-5 text-red-500 mr-3" /></div>
                  <div>
                      <p className="text-sm font-bold text-red-800">Đăng nhập không thành công</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                      {errorType === 'unverified' && (
                          <button
                              type="button"
                              onClick={handleGoToVerify}
                              className="mt-2 text-sm font-medium text-red-800 underline hover:text-red-600"
                          >
                              Gửi lại email xác thực
                          </button>
                      )}
                  </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${baseInputClasses} rounded-t-md ${errorType === 'credentials' ? inputErrorClasses : inputDefaultClasses}`}
                placeholder="Địa chỉ email"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            <div>
              <label htmlFor="password-2" className="sr-only">Mật khẩu</label>
              <input
                id="password-2"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`${baseInputClasses} rounded-b-md ${errorType === 'credentials' ? inputErrorClasses : inputDefaultClasses}`}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;