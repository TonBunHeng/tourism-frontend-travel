import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { deletionRequestService } from '../../services/deletionRequestService';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import DeletionHeader from './DeletionHeader';

export default function DeletionRequests() {
  const { user } = useAuth();
  const { showConfirm, showSuccess, showError } = useAlert();
  const [email, setEmail] = useState(user?.email || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const userName = user?.name || 'Account';

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify a reason for deletion');
      return;
    }

    const confirmed = await showConfirm({
      title: `Warning: Delete Account "${userName}"`,
      message: `Are you sure you want to permanently delete account "${userName}" (${email || user?.email})?\n\nWarning: This action is permanent and cannot be undone. All your saved wishlist destinations, badges, earned achievements, community reviews, and travel activity will be permanently erased from AngkorVerses.`,
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deletionRequestService.createDeletionRequest({
        email: email.trim(),
        reason: reason.trim(),
      });
      const msg = `Your account deletion request for "${userName}" has been submitted. Our administration team will process it within 30 days.`;
      setSuccessMsg(msg);
      showSuccess(msg, 'Deletion Request Submitted');
      setReason('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit deletion request.');
      showError(err.message || 'Failed to submit deletion request.', 'Submission Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DeletionHeader />

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-5 shadow-xs transition-colors">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 text-xs leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            Important Warning Regarding Account Deletion
          </p>
          <p>
            Submitting this request initiates the permanent erasure of your account <span className="font-bold text-red-600 dark:text-red-400">&quot;{userName}&quot;</span>, saved wishlist, earned badges/achievements, and review logs from the AngkorVerses database.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-md flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Account Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Reason for Deletion <span className="font-bold text-red-600 dark:text-red-400">&quot;Delete Account {userName}&quot;</span> *
            </label>
            <textarea
              rows={4}
              required
              placeholder={`Please describe why you would like account "${userName}" and travel logs deleted...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            {loading ? 'Submitting Request...' : 'Submit Deletion Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
