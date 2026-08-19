import React, { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import GoogleLoginButton from './GoogleLoginButton';
import logoImg from '../../assets/tourism_logo.png';

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const { showToast } = useTravel();

  const [isLogin, setIsLogin] = useState(authModal.mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
        showToast('Signed in successfully!', 'success');
      } else {
        await register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        showToast('Registration successful! Welcome to AngkorVerses.', 'success');
      }
      closeAuthModal();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs fade-in overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden zoom-in p-6 space-y-4 my-8 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <img
            src={logoImg}
            alt="AngkorVerses"
            className="w-10 h-10 rounded-lg mx-auto mb-2 object-contain"
          />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Tourist Sign In' : 'Create Tourist Account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {isLogin ? 'Access your saved destinations and badges.' : 'Join the AngkorVerses community.'}
          </p>
        </div>

        {/* Google Real Account Sign In */}
        <div className="pt-1">
          <GoogleLoginButton onSuccess={closeAuthModal} />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span className="shrink-0 mx-3 text-[10px] text-gray-400 uppercase font-semibold">Or with email</span>
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
              isLogin
                ? 'text-[#003E83] dark:text-[#60a5fa] border-b-2 border-[#003E83] dark:border-[#60a5fa]'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
              !isLogin
                ? 'text-[#003E83] dark:text-[#60a5fa] border-b-2 border-[#003E83] dark:border-[#60a5fa]'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-xs flex items-center gap-2">
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

        <div className="pt-1 text-center">
          <p className="text-[11px] text-gray-400 dark:text-zinc-500">
            Demo account: dara@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
