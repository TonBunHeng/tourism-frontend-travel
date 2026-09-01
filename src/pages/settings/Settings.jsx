import { useEffect } from 'react';
import { ShieldAlert, FileText } from 'lucide-react';
import { settingService } from '../../services/settingService';
import SettingsHeader from './SettingsHeader';

export default function Settings() {
  useEffect(() => {
    settingService.getSettings().catch((err) => {
      console.error('Failed to load settings', err);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SettingsHeader />

      <div className="space-y-6">
        
        {/* Emergency Assistance */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-4 shadow-xs transition-colors">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            24/7 Emergency Contacts in Cambodia
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-400">National Police</span>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-1">117</p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Nationwide emergency dispatch</p>
            </div>

            <div className="p-3.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] uppercase font-bold text-[#003E83] dark:text-blue-300">Tourist Police</span>
              <p className="text-base font-bold text-[#003E83] dark:text-blue-300 mt-1">+855 31 322 2117</p>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400 mt-0.5">English-speaking visitor unit</p>
            </div>

            <div className="p-3.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">Ambulance & Medical</span>
              <p className="text-base font-bold text-rose-700 dark:text-rose-400 mt-1">119</p>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400 mt-0.5">First response & hospital</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-3 shadow-xs text-xs text-gray-600 dark:text-zinc-300 leading-relaxed transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#003E83] dark:text-[#60a5fa]" />
            Cultural Guidelines & Temple Etiquette
          </h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-gray-900 dark:text-white">Temple Dress Code:</strong> Shoulders and knees must be covered when visiting sacred temples including Angkor Wat.</li>
            <li><strong className="text-gray-900 dark:text-white">Respecting Monks:</strong> Always ask permission before photographing monks and maintain polite posture.</li>
            <li><strong className="text-gray-900 dark:text-white">Currency:</strong> US Dollars (USD) and Cambodian Riel (KHR) are both widely accepted across the country.</li>
            <li><strong className="text-gray-900 dark:text-white">Hydration:</strong> Drink bottled or filtered water throughout your trips, especially during sunny temple walks.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
