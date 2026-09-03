import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Lock, 
  Trash2, 
  Upload, 
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import ProfileHeader from './ProfileHeader';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, uploadAvatar, deleteAvatar, openAuthModal, isAuthenticated, logout } = useAuth();
  const { showToast } = useTravel();
  const { showSuccess, showError, showWarning, showConfirm } = useAlert();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <User className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to View Profile</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Please sign in to your tourist account to access your profile and travel history.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to sign out of your account?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      await logout();
      showToast('Signed out successfully', 'info');
      navigate('/');
    }
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file (PNG, JPG, JPEG, WEBP).', 'Invalid File');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Profile image file size must be less than 5MB.', 'File Too Large');
      return;
    }

    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      showToast('Profile photo updated!', 'success');
      showSuccess('Your profile photo has been updated successfully.', 'Photo Updated');
    } catch (err) {
      showError(err.message || 'Failed to upload profile photo.', 'Upload Failed');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    const confirmed = await showConfirm({
      title: 'Remove Profile Photo',
      message: 'Are you sure you want to remove your profile photo? Your avatar will revert to your name initial.',
      confirmText: 'Remove Photo',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    setUploadingAvatar(true);
    try {
      await deleteAvatar();
      showToast('Profile photo removed.', 'info');
      showSuccess('Your profile photo has been removed.', 'Photo Removed');
    } catch (err) {
      showError(err.message || 'Failed to remove profile photo.', 'Error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage('');

    try {
      await updateProfile({ name, phone, location, bio });
      showToast('Profile updated successfully!', 'success');
      showSuccess('Your personal profile details have been saved successfully.', 'Profile Saved');
      setProfileMessage('Your profile changes have been saved.');
    } catch (err) {
      showError(err.message || 'Failed to update profile details.', 'Update Failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      showWarning('New password and confirmation password do not match.', 'Password Mismatch');
      return;
    }

    setLoadingPassword(true);
    try {
      await authService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      showToast('Password changed successfully!', 'success');
      showSuccess('Your account password has been updated successfully.', 'Password Updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
      showError(err.message || 'Current password was incorrect.', 'Password Update Failed');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'My Profile' }]} />
      <ProfileHeader onLogout={handleLogout} />

      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarSelect}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4 shadow-xs h-fit transition-colors">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-zinc-800 shadow-md overflow-hidden relative">
              {uploadingAvatar ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>

            {/* Camera Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] text-white dark:text-zinc-950 shadow-md border-2 border-white dark:border-zinc-800 transition-transform group-hover:scale-110 cursor-pointer disabled:opacity-50"
              title="Upload / Change profile photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 w-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {user?.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
              {user?.email}
            </p>
          </div>

          {/* Photo Actions: Upload / Change / Delete */}
          <div className="flex flex-col gap-2 w-full pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="w-full py-1.5 px-3 rounded-md bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-zinc-700 text-[#003E83] dark:text-[#60a5fa] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{user?.avatar ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            {user?.avatar && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={uploadingAvatar}
                className="w-full py-1.5 px-3 rounded-md border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800 w-full justify-center">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003E83] dark:bg-zinc-800 dark:text-[#60a5fa] uppercase tracking-wider">
              {(user?.role || 'Traveler').replace('_', ' ')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 uppercase tracking-wider">
              {user?.status || 'Active'}
            </span>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Cards */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Edit Profile Form Card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-5 space-y-4 shadow-xs transition-colors">
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                Personal Information
              </h2>
              <span className="text-[11px] font-normal text-gray-400 dark:text-zinc-500">Public profile details</span>
            </div>

            {profileMessage && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Email (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 text-xs rounded-md border border-gray-200 dark:border-zinc-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+855 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Phnom Penh, Cambodia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Travel Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short bio, your favorite Angkor temples, or travel interests..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="px-4 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loadingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-5 space-y-4 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                Change Password
              </span>
              <span className="text-[11px] font-normal text-gray-400 dark:text-zinc-500">Security credentials</span>
            </h2>

            {passwordError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
