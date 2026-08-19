import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleLoginButton from '../../components/common/GoogleLoginButton';
import logoImg from '../../assets/tourism_logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
      }
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed');
      if (err.errors) setErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 space-y-4 transition-colors">
        <div className="text-center space-y-1">
          <img
            src={logoImg}
            alt="AngkorVerses"
            className="w-12 h-12 rounded-lg mx-auto mb-2 object-contain"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Tourist Sign In' : 'Create Tourist Account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {isLogin ? 'Access your saved destinations and reviews' : 'Join the AngkorVerses community'}
          </p>
        </div>

        {/* Real Google Login */}
        <div className="pt-1">
          <GoogleLoginButton onSuccess={() => navigate('/')} />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span className="shrink-0 mx-3 text-[10px] text-gray-400 uppercase font-semibold">Or with credentials</span>
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 rounded-t">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold text-center cursor-pointer ${
              isLogin
                ? 'bg-white dark:bg-zinc-900 text-[#003E83] dark:text-[#60a5fa] border-b-2 border-[#003E83] dark:border-[#60a5fa]'
                : 'text-gray-500 dark:text-zinc-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold text-center cursor-pointer ${
              !isLogin
                ? 'bg-white dark:bg-zinc-900 text-[#003E83] dark:text-[#60a5fa] border-b-2 border-[#003E83] dark:border-[#60a5fa]'
                : 'text-gray-500 dark:text-zinc-400'
            }`}
          >
            Register
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isLogin && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              {errors.name && <p className="text-red-600 dark:text-red-400 mt-0.5">{errors.name[0]}</p>}
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
            />
            {errors.email && <p className="text-red-600 dark:text-red-400 mt-0.5">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
