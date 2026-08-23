import { useState, useRef, useEffect, useCallback } from 'react';
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
  Moon,
  Bell,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { useAlert } from '../../context/AlertContext';
import { getInitialTheme, applyTheme, THEME_CHANGE_EVENT, isDarkTheme } from '../../utils/Theme';
import notificationService from '../../services/notificationService';
import logoImg from '../../assets/tourism_logo.png';

export default function Header() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { showConfirm } = useAlert();
  const { wishlistCount, toggleChat } = useTravel();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => isDarkTheme(getInitialTheme()));

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffSec = Math.floor((now - date) / 1000);

      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const fetchTravelNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const res = await notificationService.getNotifications({ limit: 5 });
      const data = res?.data || res || [];
      const notifs = Array.isArray(data) ? data : (data.data || []);
      setNotifications(notifs);

      if (res?.meta?.unread_count !== undefined) {
        setUnreadCount(res.meta.unread_count);
      } else {
        setUnreadCount(notifs.filter(n => !n.read).length);
      }
    } catch {
      // Gracefully ignore network errors on header poll
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;
    const loadNotifs = async () => {
      if (isMounted) {
        await fetchTravelNotifications();
      }
    };
    loadNotifs();

    const handleUpdate = () => fetchTravelNotifications();
    window.addEventListener('travel-notifications-updated', handleUpdate);
    const interval = setInterval(fetchTravelNotifications, 45000);
    return () => {
      isMounted = false;
      window.removeEventListener('travel-notifications-updated', handleUpdate);
      clearInterval(interval);
    };
  }, [fetchTravelNotifications]);

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Sign Out',
      type: 'danger'
    });
    if (confirmed) {
      logout();
      setDropdownOpen(false);
      setNotifDropdownOpen(false);
      setMenuOpen(false);
    }
  };

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
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuOpen(false);
      setDropdownOpen(false);
      setNotifDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleMarkAllRead = async (e) => {
    e?.stopPropagation();
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent('travel-notifications-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    setNotifDropdownOpen(false);
    if (!notif.read) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        window.dispatchEvent(new CustomEvent('travel-notifications-updated'));
      } catch (err) {
        console.error(err);
      }
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const navLinks = [
    { name: 'Destinations', path: '/places', icon: Compass },
    { name: 'Provinces', path: '/provinces', icon: MapPin },
    { name: 'Categories', path: '/categories', icon: Sparkles },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  ];

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#003E83]/10 dark:bg-blue-900/30 flex items-center justify-center p-1 border border-gray-200/60 dark:border-zinc-700/60 group-hover:scale-105 transition-transform">
              <img
                src={logoImg}
                alt="AngkorVerses"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-tight block group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors">
                Angkor<span className="text-[#003E83] dark:text-[#60a5fa]">Verses</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                Travel & Culture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#003E83] dark:text-[#60a5fa] font-semibold shadow-2xs border border-blue-100/80 dark:border-blue-800/40'
                      : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-100/70 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#003E83] dark:text-[#60a5fa]' : 'text-gray-400 dark:text-zinc-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar (Desktop / Tablet) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative min-w-[150px] max-w-[200px] lg:max-w-[250px] xl:max-w-xs w-full transition-all">
            <input
              type="text"
              placeholder="Search destinations..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-gray-100/80 dark:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003E83]/20 dark:focus:ring-blue-400/20 focus:border-[#003E83] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 truncate transition-all"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {navSearch && (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-lg transition-colors ${
                isLinkActive('/wishlist')
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-xs">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown (Bell) */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('login');
                  } else {
                    setNotifDropdownOpen(!notifDropdownOpen);
                  }
                }}
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                  notifDropdownOpen
                    ? 'bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa]'
                    : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50 animate-smooth-pop">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/40">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#003E83]/10 text-[#003E83] dark:bg-blue-950/80 dark:text-blue-400 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#003E83] dark:text-[#60a5fa] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-[#003E83] dark:bg-blue-400 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-zinc-300 line-clamp-2 mt-0.5">
                            {notification.description}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500 block mt-1.5">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center px-4">
                        <Bell className="w-8 h-8 text-gray-300 dark:text-zinc-600 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">No notifications yet</p>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">You're all caught up with Angkor news & updates</p>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 border-t border-gray-100 dark:border-zinc-800 text-center bg-gray-50/80 dark:bg-zinc-900">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-[#003E83] dark:text-[#60a5fa] hover:underline font-bold flex items-center justify-center gap-1"
                    >
                      <span>View all in Notifications Center</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Sign In / Register */}
            {isAuthenticated ? (
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    dropdownOpen
                      ? 'border-[#003E83] dark:border-blue-400 bg-blue-50/50 dark:bg-zinc-800'
                      : 'border-gray-200 dark:border-zinc-700 bg-gray-50/80 dark:bg-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white dark:ring-zinc-900"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#003E83] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="max-w-[85px] lg:max-w-[110px] truncate text-xs font-semibold text-gray-800 dark:text-zinc-200">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 py-1.5 z-50 animate-smooth-pop text-xs">
                    <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded">Active</span>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white truncate text-xs mt-0.5">{user?.name}</p>
                      <p className="text-gray-500 dark:text-zinc-400 truncate text-[11px]">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <User className="w-3.5 h-3.5 text-gray-400" /> My Profile
                      </Link>
                      <Link to="/notifications" className="flex items-center justify-between px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Bell className="w-3.5 h-3.5 text-gray-400" /> Notifications
                        </div>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full font-bold text-[10px]">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      <Link to="/wishlist" className="flex items-center justify-between px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Heart className="w-3.5 h-3.5 text-gray-400" /> Saved Wishlist
                        </div>
                        {wishlistCount > 0 && (
                          <span className="text-gray-400 text-[11px] font-semibold">{wishlistCount}</span>
                        )}
                      </Link>
                      <Link to="/achievements" className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <Award className="w-3.5 h-3.5 text-gray-400" /> Badges & Points
                      </Link>
                      <button 
                        onClick={() => { setDropdownOpen(false); toggleChat(); }} 
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] text-left font-medium transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> AI Support Chat
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-zinc-800/80 py-1">
                      <Link to="/settings" className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <Settings className="w-3.5 h-3.5 text-gray-400" /> Emergency & Help
                      </Link>
                      <Link to="/deletion-request" className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#003E83] dark:hover:text-[#60a5fa] font-medium transition-colors">
                        <ShieldAlert className="w-3.5 h-3.5 text-gray-400" /> Privacy & Data
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-1">
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 text-gray-700 dark:text-zinc-300 hover:text-[#003E83] dark:hover:text-[#60a5fa] hover:bg-gray-100/70 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 text-white bg-[#003E83] hover:bg-[#002e62] dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 md:hidden transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-lg px-4 py-4 pb-24 space-y-3 animate-smooth-pop text-xs shadow-xl relative z-50 max-h-[85vh] overflow-y-auto"
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search destinations, temples..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-8.5 pr-8 py-2 text-xs bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003E83] text-gray-900 dark:text-white placeholder-gray-400"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {navSearch && (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Mobile Navigation Links */}
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#003E83] dark:text-[#60a5fa]'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#003E83] dark:text-[#60a5fa]' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Access Badges/Links */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 space-y-1">
            <Link
              to="/wishlist"
              className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full font-bold text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/achievements"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Badges & Achievements</span>
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                toggleChat();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>AI Support Assistant</span>
            </button>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>Emergency Guidelines</span>
            </Link>
          </div>

          {/* Auth Section in Mobile Menu */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 pb-8">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-1">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#003E83] text-white font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-gray-500 dark:text-zinc-400 text-[11px] truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pr-12 sm:pr-0">
                <button
                  onClick={() => openAuthModal('login')}
                  className="py-2 text-center font-bold rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="py-2 text-center font-bold rounded-lg bg-[#003E83] hover:bg-[#002e62] text-white transition-colors shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

