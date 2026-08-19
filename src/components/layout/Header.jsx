import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Image as ImageIcon, 
  Heart, 
  Award, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Settings,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { getInitialTheme, applyTheme, THEME_CHANGE_EVENT, isDarkTheme } from '../../utils/Theme';
import logoImg from '../../assets/tourism_logo.png';

export default function Header() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { wishlistCount, toggleChat } = useTravel();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => isDarkTheme(getInitialTheme()));
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && typeof e.detail.isDark === 'boolean') {
        setIsDarkMode(e.detail.isDark);
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    applyTheme(nextMode ? 'dark' : 'light');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/places?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Destinations', path: '/places', icon: Compass },
    { name: 'Provinces', path: '/provinces', icon: MapPin },
    { name: 'Categories', path: '/categories', icon: Sparkles },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="AngkorVerses"
              className="w-8 h-8 rounded-md object-contain"
            />
            <div>
              <span className="text-base font-bold text-gray-900 dark:text-white leading-none block">
                Angkor<span className="text-[#003E83] dark:text-[#60a5fa]">Verses</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                Tourist Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa]'
                      : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#003E83] dark:text-[#60a5fa]' : 'text-gray-400 dark:text-zinc-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-40 lg:w-48 pl-7 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </form>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-md text-gray-600 dark:text-zinc-300 hover:text-[#003E83] dark:hover:text-[#60a5fa] hover:bg-gray-50 dark:hover:bg-zinc-800"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 bg-[#003E83] dark:bg-[#60a5fa] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/achievements"
              className="p-2 rounded-md text-gray-600 dark:text-zinc-300 hover:text-[#003E83] dark:hover:text-[#60a5fa] hover:bg-gray-50 dark:hover:bg-zinc-800"
              title="Badges"
            >
              <Award className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-800 dark:text-zinc-200 cursor-pointer"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#003E83] text-white font-bold text-[10px] flex items-center justify-center">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50 fade-in text-xs">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800">
                      <p className="text-gray-400 text-[10px] uppercase font-bold">User</p>
                      <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-gray-500 dark:text-zinc-400 truncate text-[11px]">{user?.email}</p>
                    </div>

                    <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Profile
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
                      <Heart className="w-3.5 h-3.5 text-gray-400" /> Wishlist ({wishlistCount})
                    </Link>
                    <Link to="/achievements" className="flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
                      <Award className="w-3.5 h-3.5 text-gray-400" /> Badges
                    </Link>
                    <button onClick={() => { setDropdownOpen(false); toggleChat(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] text-left">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Support Chat
                    </button>
                    <Link to="/deletion-request" className="flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
                      <ShieldAlert className="w-3.5 h-3.5 text-gray-400" /> Data Privacy
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
                      <Settings className="w-3.5 h-3.5 text-gray-400" /> Emergency & Policies
                    </Link>

                    <div className="border-t border-gray-100 dark:border-zinc-800 mt-1 pt-1">
                      <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-semibold">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-[#003E83] dark:hover:text-[#60a5fa] hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#003E83] hover:bg-[#002e62] rounded-md shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleToggleTheme}
              className="p-1.5 rounded-md text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-md text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-1.5 text-xs">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa]">
              <link.icon className="w-3.5 h-3.5 text-gray-400" /> {link.name}
            </Link>
          ))}
          <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <Heart className="w-3.5 h-3.5 text-gray-400" /> Wishlist ({wishlistCount})
          </Link>
          <Link to="/achievements" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <Award className="w-3.5 h-3.5 text-gray-400" /> Badges
          </Link>
          <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <ShieldAlert className="w-3.5 h-3.5 text-gray-400" /> Emergency
          </Link>
          {isAuthenticated ? (
            <button onClick={logout} className="w-full text-left px-3 py-2 font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md">
              Sign Out ({user?.name})
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => openAuthModal('login')} className="py-1.5 text-center font-semibold rounded-md border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300">
                Sign In
              </button>
              <button onClick={() => openAuthModal('register')} className="py-1.5 text-center font-semibold rounded-md bg-[#003E83] text-white">
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
