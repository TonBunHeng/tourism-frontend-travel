import { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService';
import { useAuth } from '../../context/AuthContext';
import AchievementsHeader from './AchievementsHeader';
import AchievementsGrid from './AchievementsGrid';

export default function Achievements() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        if (isAuthenticated) {
          const res = await achievementService.getMyAchievements();
          if (res?.data) {
            setAchievements(res.data);
          }
        } else {
          const res = await achievementService.getAchievements();
          if (res?.data) {
            setAchievements(res.data.map((b) => ({ ...b, is_unlocked: false })));
          }
        }
      } catch (err) {
        console.error('Failed to load achievements', err);
      }
    };

    fetchBadges();
  }, [isAuthenticated]);

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AchievementsHeader unlockedCount={unlockedCount} totalCount={achievements.length} />

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3.5 flex items-center justify-between text-xs text-[#003E83]">
          <span>Sign in to record your unlocked explorer achievements.</span>
          <button
            onClick={() => openAuthModal('login')}
            className="px-3 py-1 bg-[#003E83] text-white rounded font-semibold hover:bg-[#002e62]"
          >
            Sign In
          </button>
        </div>
      )}

      <AchievementsGrid achievements={achievements} />
    </div>
  );
}
