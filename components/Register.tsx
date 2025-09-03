
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Icon } from './shared/Icon.tsx';

const PasswordCriterion: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <li className={`flex items-center text-sm transition-colors ${met ? 'text-green-600' : 'text-gray-500'}`}>
        <Icon name={met ? 'check-circle' : 'x-circle'} className={`w-4 h-4 mr-2 flex-shrink-0 ${met ? 'text-green-500' : 'text-gray-400'}`} />
        {text}
    </li>
);

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('Học sinh');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    const length = pass.length >= 8;
    const uppercase = /[A-Z]/.test(pass);
    const lowercase = /[a-z]/.test(pass);
    const number = /[0-9]/.test(pass);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    setPasswordCriteria({ length, uppercase, lowercase, number, specialChar });
    return length && uppercase && lowercase && number && specialChar;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const isPasswordStrong = validatePassword(password);
    if (!isPasswordStrong) {
        setError('Mật khẩu không đủ mạnh. Vui lòng đáp ứng tất cả các tiêu chí.');
        return;
    }
    
    if (!age || parseInt(age) < 3) {
        setError('Tuổi không hợp lệ. Bạn phải ít nhất 3 tuổi.');
        return;
    }

    setLoading(true);
    const result = await register(username, email, password, parseInt(age, 10), role);
    setLoading(false);

    if (result.success) {
      navigate('/verify-email', { state: { email } });
    } else {
      setError(result.error || 'Đăng ký thất bại.');
    }
  };
  
  const getButtonText = () => {
    if (loading) return 'Đang xử lý...';
    return 'Đăng ký';
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
           <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-400">
             <Icon name="logo" className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập nếu bạn đã có tài khoản
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span>{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
             <div>
              <label htmlFor="username" className="sr-only">Tên tài khoản</label>
              <input id="username" name="username" type="text" required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tên tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             <div>
              <label htmlFor="age" className="sr-only">Tuổi</label>
              <input id="age" name="age" type="number" required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tuổi"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500 px-1">
                Nên điền tuổi thật vì trang web mở cho cả trẻ 3 tuổi, có cơ hội được các trường đại học top đầu như VinUni để ý tới.
              </p>
            </div>
             <div>
              <label htmlFor="role" className="sr-only">Bạn là</label>
              <select id="role" name="role" required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Học sinh">Học sinh</option>
                <option value="Sinh viên">Sinh viên</option>
                <option value="Nhà nghiên cứu tự do">Nhà nghiên cứu tự do</option>
                <option value="Nhà báo (nhà tuyển dụng)">Nhà báo (nhà tuyển dụng)</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="Mật khẩu"
                value={password}
                onChange={handlePasswordChange}
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
             <div className="pt-2 px-1">
                <ul className="space-y-1">
                    <PasswordCriterion met={passwordCriteria.length} text="Ít nhất 8 ký tự" />
                    <PasswordCriterion met={passwordCriteria.lowercase} text="Một chữ cái viết thường (a-z)" />
                    <PasswordCriterion met={passwordCriteria.uppercase} text="Một chữ cái viết hoa (A-Z)" />
                    <PasswordCriterion met={passwordCriteria.number} text="Một chữ số (0-9)" />
                    <PasswordCriterion met={passwordCriteria.specialChar} text="Một ký tự đặc biệt (!@#$...)" />
                </ul>
            </div>
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Xác nhận mật khẩu</label>
              <input id="confirm-password" name="confirm-password" type={showConfirmPassword ? 'text' : 'password'} required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
