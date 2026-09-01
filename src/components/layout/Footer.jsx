import { Link } from 'react-router-dom';
import { Phone, ShieldAlert } from 'lucide-react';
import logoImg from '../../assets/tourism_logo.png';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 pt-10 pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Assistance Bar */}
        <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/60 rounded-lg p-3.5 mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">24/7 Tourist Emergency Hotlines</h4>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">Official assistance lines across Cambodia</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:117"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <Phone className="w-3 h-3 text-[#003E83] dark:text-[#60a5fa]" />
              Police: 117
            </a>
            <a
              href="tel:+855313222117"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#003E83] hover:bg-[#002e62] text-white text-[11px] font-semibold"
            >
              <Phone className="w-3 h-3" />
              Tourist Police: +855 31 322 2117
            </a>
            <a
              href="tel:119"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <Phone className="w-3 h-3" />
              Ambulance: 119
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-gray-200 dark:border-zinc-800 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="AngkorVerses"
                className="w-7 h-7 rounded object-contain"
              />
              <span className="font-bold text-gray-900 dark:text-white text-sm">AngkorVerses</span>
            </div>
            <p className="text-gray-500 dark:text-zinc-400 text-[11px] leading-relaxed">
              Official smart tourism platform for discovering attractions, events, and cultural heritage.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Explore</h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-zinc-400 text-[11px]">
              <li><Link to="/places" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Destinations</Link></li>
              <li><Link to="/provinces" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">25 Provinces</Link></li>
              <li><Link to="/categories" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Categories</Link></li>
              <li><Link to="/events" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Events & Festivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Tools</h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-zinc-400 text-[11px]">
              <li><Link to="/wishlist" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Saved Wishlist</Link></li>
              <li><Link to="/achievements" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Badges & Milestones</Link></li>
              <li><Link to="/profile" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">My Profile</Link></li>
              <li><Link to="/deletion-request" className="hover:text-[#003E83] dark:hover:text-[#60a5fa]">Data Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Support</h4>
            <p className="text-gray-500 dark:text-zinc-400 text-[11px] leading-relaxed">
              For visitor inquiries and assistance: <span className="font-semibold text-gray-800 dark:text-zinc-200">support@tourism.gov.kh</span>
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} AngkorVerses — Kingdom of Cambodia.</p>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="hover:text-gray-600 dark:hover:text-zinc-300">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-gray-600 dark:hover:text-zinc-300">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
