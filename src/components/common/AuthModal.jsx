import { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, Compass, Building2, Sparkles, Check, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import logoImg from '../../assets/tourism_logo.png';

const ROLES = [
  {
    id: 'user',
    name: 'Tourist / Traveler',
    subtitle: 'Explore places, save favorites & reviews',
    icon: Compass,
    color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-[#003E83] dark:text-[#60a5fa]',
  },
  {
    id: 'business_owner',
    name: 'Business Owner',
    subtitle: 'Manage hotel, dining, tours & services',
    icon: Building2,
    color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  },
  {
    id: 'guide_editor',
    name: 'Guide / Editor',
    subtitle: 'Publish attractions, events & stories',
    icon: Sparkles,
    color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  },
];

const DEMO_ACCOUNTS = [
  { role: 'Tourist', email: 'vit.vong@example.com', pass: 'password123' },
  { role: 'Business Owner', email: 'owner@angkor-restaurant.com', pass: 'password123' },
  { role: 'Guide', email: 'sopheaktra@tourism.gov.kh', pass: 'password123' },
];

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const { showToast } = useTravel();

  const [modeOverride, setModeOverride] = useState(null);
  const isLogin = modeOverride !== null ? modeOverride : authModal.mode === 'login';

  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  if (!authModal.isOpen) return null;

  const handleClose = () => {
    setModeOverride(null);
    closeAuthModal();
  };

  const handleFillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});

    if (!isLogin) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name or business name.');
        return;
      }
      if (password !== passwordConfirmation) {
        setErrorMessage('Password and Confirm Password do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: email.trim(), password });
        showToast('Signed in successfully!', 'success');
      } else {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
          role: selectedRole,
        });
        showToast(`Registration successful! Welcome as ${selectedRole.replace('_', ' ')}.`, 'success');
      }
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 fade-in overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden zoom-in p-5 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <img
            src={logoImg}
            alt="AngkorVerses"
            className="w-11 h-11 rounded-lg mx-auto mb-2 object-contain"
          />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Sign In to AngkorVerses' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {isLogin
              ? 'Access your trips, business listings, or guide portal.'
              : 'Choose your account type to join the platform.'}
          </p>
        </div>

        {/* Social Sign In (Google & Facebook) */}
        {isLogin && (
          <div className="pt-1 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <GoogleLoginButton onSuccess={handleClose} />
              <FacebookLoginButton onSuccess={handleClose} />
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
              <span className="shrink-0 mx-3 text-[10px] text-gray-400 uppercase font-semibold">Or with credentials</span>
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
            </div>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setModeOverride(true); setErrorMessage(''); }}
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
            onClick={() => { setModeOverride(false); setErrorMessage(''); }}
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Role selection when creating account */}
          {!isLogin && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Account Type / Role *
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none cursor-pointer"
              >
                <option value="user">Tourist / Traveler</option>
                <option value="business_owner">Business Owner</option>
                <option value="guide_editor">Guide / Editor</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Full Name / Business Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'business_owner' ? 'e.g., Angkor Heritage Retreat' : 'e.g., Sokha Dara'}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              {errors.name && <p className="text-red-600 dark:text-red-400 mt-0.5">{errors.name[0]}</p>}
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
            />
            {errors.email && <p className="text-red-600 dark:text-red-400 mt-0.5">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Password *</label>
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
              <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">Confirm Password *</label>
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

        {/* Quick Demo Credentials */}
        {isLogin && (
          <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-1.5">
              Quick Demo Accounts
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleFillDemo(d)}
                  className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>{d.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
