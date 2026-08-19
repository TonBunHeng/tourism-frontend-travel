import React from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export default function AchievementsGrid({ achievements, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((item) => {
        const isUnlocked = Boolean(item.is_unlocked || item.unlocked_at);

        return (
          <div
            key={item.id}
            className={`p-5 rounded-lg border transition-all duration-200 flex items-start gap-4 ${
              isUnlocked
                ? 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xs'
                : 'bg-gray-50 dark:bg-zinc-900/40 border-gray-200 dark:border-zinc-800/80 opacity-75'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                isUnlocked
                  ? 'bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa]'
                  : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600'
              }`}
            >
              {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.badge_name || item.name}
                </h3>
                {isUnlocked && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                {item.description || 'Milestone reward badge for tourism activities.'}
              </p>

              {item.points && (
                <span className="inline-block text-[11px] font-semibold text-[#003E83] dark:text-[#60a5fa] pt-1">
                  +{item.points} Points
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
