import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { provinceService } from '../services/provinceService';
import { favoriteService } from '../services/favoriteService';
import { settingService } from '../services/settingService';
import { useAuth } from './AuthContext';

const TravelContext = createContext(null);

export const TravelProvider = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [settings, setSettings] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [catsRes, provsRes, settingsRes] = await Promise.allSettled([
          categoryService.getCategories(),
          provinceService.getProvinces(),
          settingService.getSettings(),
        ]);

        if (catsRes.status === 'fulfilled' && catsRes.value?.data) {
          setCategories(catsRes.value.data);
        }
        if (provsRes.status === 'fulfilled' && provsRes.value?.data) {
          setProvinces(provsRes.value.data);
        }
        if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
          setSettings(settingsRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load global tourism metadata', err);
      }
    };

    fetchGlobalData();
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await favoriteService.getFavorites();
        if (res?.data) {
          setFavorites(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch favorites', e);
      }
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (placeId) => {
    return favorites.some((fav) => fav.place_id === Number(placeId) || fav.place?.id === Number(placeId));
  };

  const toggleFavorite = async (place) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('Please log in to save favorites to your wishlist', 'info');
      return;
    }

    const placeId = place.id || place.place_id;
    const existing = favorites.find((f) => f.place_id === placeId || f.place?.id === placeId);

    if (existing) {
      try {
        await favoriteService.removeFavorite(placeId);
        setFavorites((prev) => prev.filter((f) => f.place_id !== placeId && f.place?.id !== placeId));
        showToast(`Removed "${place.name}" from wishlist`, 'info');
      } catch (e) {
        showToast('Failed to remove favorite', 'error');
      }
    } else {
      try {
        const res = await favoriteService.addFavorite({ place_id: placeId, visited: false });
        if (res?.data) {
          setFavorites((prev) => [res.data, ...prev]);
          showToast(`Added "${place.name}" to wishlist!`, 'success');
        }
      } catch (e) {
        showToast('Failed to add favorite', 'error');
      }
    }
  };

  return (
    <TravelContext.Provider
      value={{
        favorites,
        wishlistCount: favorites.length,
        isFavorite,
        toggleFavorite,
        fetchFavorites,
        categories,
        provinces,
        settings,
        chatOpen,
        setChatOpen,
        toggleChat: () => setChatOpen((prev) => !prev),
        toast,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg border border-gray-800 animate-in">
          <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-rose-400' : 'bg-blue-400'}`}></span>
          <p className="font-medium">{toast.message}</p>
        </div>
      )}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
