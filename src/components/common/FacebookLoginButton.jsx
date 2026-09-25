import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';

const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '1084920496184291';

export default function FacebookLoginButton({ onSuccess, onError }) {
  const { facebookLogin } = useAuth();
  const { showToast } = useTravel();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.FB && !document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      js.onload = () => {
        if (window.FB) {
          try {
            window.FB.init({
              appId: FB_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v19.0',
            });
          } catch {
            // ignore init error
          }
        }
      };
      document.body.appendChild(js);
    }
  }, []);

  const handleFacebookLogin = async () => {
    showToast('Facebook Sign-In is coming soon! Please sign in with Google or Email.', 'info');
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] hover:bg-[#0d65d9] text-white rounded-md text-xs font-semibold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60"
    >
      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>
        {loading ? 'Connecting with Facebook...' : (
          <>
            Continue with Facebook <span className="text-[10px] font-normal opacity-85">(soon)</span>
          </>
        )}
      </span>
    </button>
  );
}
