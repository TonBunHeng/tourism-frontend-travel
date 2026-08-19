import React, { useState } from 'react';
import { User, Camera, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { authService } from '../../services/authService';
import ProfileHeader from './ProfileHeader';

export default function Profile() {
  const { user, updateProfile, uploadAvatar, openAuthModal, isAuthenticated } = useAuth();
  const { showToast } = useTravel();

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

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <User className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Sign in to View Profile</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-[#003E83] hover:bg-[#002e62] text-white text-xs font-semibold rounded-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage('');

    try {
      await updateProfile({ name, phone, location, bio });
      showToast('Profile updated successfully!', 'success');
      setProfileMessage('Your changes have been saved.');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      showToast('Avatar updated!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#003E83] text-white text-2xl font-bold flex items-center justify-center">
                  {user?.name?.charAt(0) || 'T'}
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer hover:bg-gray-800"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">{user?.name}</h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-gray-100 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#003E83] border border-blue-200">
                {user?.role || 'Tourist'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Personal Information
            </h2>

            {profileMessage && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-1.5 bg-gray-50 text-gray-400 text-xs rounded-md border border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+855 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Phnom Penh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Travel Bio</label>
                <textarea
                  rows={2}
                  placeholder="Share a short bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="px-4 py-1.5 bg-[#003E83] hover:bg-[#002e62] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {loadingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Change Password
            </h2>

            {passwordError && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded-md border border-gray-300 focus:border-[#003E83] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
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
