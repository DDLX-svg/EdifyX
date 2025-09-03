
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Icon } from './shared/Icon.tsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for unverified account flow
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const { login, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  // Cooldown timer effect
  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) {
        setError('');
        setUnverifiedEmail(null);
        setResendMessage('');
        setResendError('');
    }
  };
  
  const handleResend = async () => {
    if (cooldown > 0 || !unverifiedEmail) return;
    setResendLoading(true);
    setResendMessage('');
    setResendError('');

    const result = await resendVerificationEmail(unverifiedEmail);
    
    if (result.success) {
        setResendMessage('Email xác thực mới đã được gửi.');
        setCooldown(60);
    } else {
        setResendError(result.error || 'Gửi lại email thất bại.');
    }
    setResendLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail(null);
    setResendMessage('');
    setResendError('');
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);
    if (result.success) {
      navigate('/');
    } else if (result.reason === 'unverified' && result.email) {
      setError(result.error || 'Tài khoản chưa được xác thực.');
      setUnverifiedEmail(result.email);
    } else {
      setError(result.error || 'Đăng nhập thất bại.');
    }
  };

  const isCredentialError = error && !unverifiedEmail;
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
            <div className={`border-l-4 p-4 ${unverifiedEmail ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'}`} role="alert">
                <div className="flex">
                    <div className="py-1">
                        <Icon name="alert" className={`h-5 w-5 mr-3 ${unverifiedEmail ? 'text-yellow-500' : 'text-red-500'}`} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${unverifiedEmail ? 'text-yellow-800' : 'text-red-800'}`}>
                            {unverifiedEmail ? 'Yêu cầu xác thực tài khoản' : 'Đăng nhập không thành công'}
                        </p>
                        <p className={`text-sm mt-1 ${unverifiedEmail ? 'text-yellow-700' : 'text-red-700'}`}>
                            {error}
                        </p>
                        {unverifiedEmail && (
                            <div className="mt-3">
                                <button type="button" onClick={handleResend} disabled={cooldown > 0 || resendLoading} className="font-bold underline hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                    {resendLoading ? 'Đang gửi...' : (cooldown > 0 ? `Gửi lại sau (${cooldown}s)` : 'Gửi lại email xác thực')}
                                </button>
                                {resendMessage && <span className="ml-4 font-normal text-sm text-green-700">{resendMessage}</span>}
                                {resendError && <span className="ml-4 font-normal text-sm text-red-700">{resendError}</span>}
                            </div>
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
                className={`${baseInputClasses} rounded-t-md ${isCredentialError ? inputErrorClasses : inputDefaultClasses}`}
                placeholder="Địa chỉ email"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password-2" className="sr-only">Mật khẩu</label>
              <input
                id="password-2"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`${baseInputClasses} rounded-b-md pr-10 ${isCredentialError ? inputErrorClasses : inputDefaultClasses}`}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <Icon name={showPassword ? 'eye-slash' : 'eye'} className="h-5 w-5" />
              </button>
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