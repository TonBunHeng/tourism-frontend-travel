import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { deletionRequestService } from '../../services/deletionRequestService';
import { useAuth } from '../../context/AuthContext';
import DeletionHeader from './DeletionHeader';

export default function DeletionRequests() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify a reason for deletion');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deletionRequestService.createDeletionRequest({
        email: email.trim(),
        reason: reason.trim(),
      });
      setSuccessMsg('Your deletion request has been logged. Our administration team will process it within 30 days.');
      setReason('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit deletion request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DeletionHeader />

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-5 shadow-xs transition-colors">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 text-xs leading-relaxed space-y-1">
          <p className="font-bold">Important Notice Regarding Account Deletion</p>
          <p>
            Submitting this request initiates the permanent erasure of your account, saved wishlist, earned achievements, and review logs from the AngkorVerses database.
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
              Reason for Deletion *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Please describe why you would like your account and travel logs deleted..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            {loading ? 'Submitting Request...' : 'Submit Deletion Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
