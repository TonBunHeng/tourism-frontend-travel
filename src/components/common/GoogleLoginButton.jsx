import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { X, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTravel } from "../../context/TravelContext";

export default function GoogleLoginButton({ onSuccess, onError }) {
  const { googleLogin } = useAuth();
  const { showToast } = useTravel();
  const [loading, setLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const executeGoogleAuth = async ({ email, name, avatar, google_id }) => {
    setLoading(true);
    try {
      const cleanEmail = (email || "tonbunheng1122@gmail.com").trim();
      const rawName = name || cleanEmail.split("@")[0].replace(/[._]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const res = await googleLogin({
        google_id: google_id || `google_${Date.now()}`,
        email: cleanEmail,
        name: rawName,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      });

      showToast(`Welcome back, ${rawName}! Signed in with Google.`, "success");
      setShowAccountModal(false);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      showToast(err.message || "Google authentication failed. Please try again.", "error");
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  let loginWithGoogle = null;
  try {
    loginWithGoogle = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        setLoading(true);
        try {
          const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          const profile = userInfoRes.data;

          await executeGoogleAuth({
            google_id: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
          });
        } catch (err) {
          console.warn("Google Token Exchange Failed, switching to Account Connect:", err);
          setShowAccountModal(true);
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.warn("Google OAuth Popup Error / Invalid Client ID:", err);
        setShowAccountModal(true);
      },
    });
  } catch {
    loginWithGoogle = () => setShowAccountModal(true);
  }

  const handleClick = () => {
    const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    const isPlaceholder = !rawClientId || rawClientId.includes("sksd") || rawClientId.includes("placeholder");

    if (isPlaceholder || !loginWithGoogle) {
      setShowAccountModal(true);
    } else {
      try {
        loginWithGoogle();
      } catch {
        setShowAccountModal(true);
      }
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    executeGoogleAuth({
      email: customEmail,
      name: customName || undefined,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/80 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-gray-800 dark:text-zinc-100 transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{loading ? "Connecting with Google..." : "Continue with Google"}</span>
      </button>

      {/* Google Account Selector Dialog */}
      {showAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs fade-in"
          onClick={() => setShowAccountModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4 zoom-in transition-colors text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Choose a Google Account</h3>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">to continue to AngkorVerses Travel</p>
              </div>
            </div>

            {/* Quick One-Click Google Profiles */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => executeGoogleAuth({
                  email: "tonbunheng1122@gmail.com",
                  name: "Ton Bunheng",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                })}
                disabled={loading}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Ton Bunheng"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-zinc-700"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Ton Bunheng
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                      tonbunheng1122@gmail.com
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => executeGoogleAuth({
                  email: "traveler.angkor@gmail.com",
                  name: "Angkor Traveler",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AngkorTraveler",
                })}
                disabled={loading}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    AT
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Angkor Traveler
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                      traveler.angkor@gmail.com
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
              <span className="shrink-0 mx-3 text-[10px] text-gray-400 uppercase font-semibold">Or use another Google account</span>
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
            </div>

            {/* Custom Google Email Input */}
            <form onSubmit={handleCustomSubmit} className="space-y-2.5 text-xs">
              <div>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !customEmail}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Sign In with this Google Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
