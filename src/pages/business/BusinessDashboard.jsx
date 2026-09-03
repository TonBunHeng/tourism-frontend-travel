import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Star, 
  Plus, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import businessService from '../../services/businessService';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function BusinessDashboard() {
  const [profileData, setProfileData] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      businessService.getOwnerProfile().catch(() => null),
      businessService.getOwnerBusinesses().catch(() => ({ data: { businesses: [] } })),
    ]).then(([profRes, bizRes]) => {
      if (!isMounted) return;
      setProfileData(profRes?.data || profRes);
      const bizList = bizRes?.data?.businesses || bizRes?.data || bizRes || [];
      setBusinesses(Array.isArray(bizList) ? bizList : []);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading Business Dashboard...</p>
      </div>
    );
  }

  const totalBusinesses = businesses.length;
  const approvedCount = businesses.filter(b => b.verification_status === 'approved').length;
  const pendingCount = businesses.filter(b => b.verification_status === 'pending').length;
  const rejectedCount = businesses.filter(b => b.verification_status === 'rejected').length;

  const totalReviews = businesses.reduce((acc, b) => acc + (b.reviews_count || b.review_count || 0), 0);
  const avgRating = businesses.length > 0 
    ? (businesses.reduce((acc, b) => acc + Number(b.rating || 0), 0) / businesses.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Business Portal' }]} />
      {/* Simple Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Business Owner Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            {profileData?.user?.name ? `Welcome, ${profileData.user.name}. ` : ''}Manage your hospitality listings, services, hours, and tourist feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/business/analytics"
            className="px-3.5 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </Link>
          <Link
            to="/business/businesses/new"
            className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Business</span>
          </Link>
        </div>
      </div>

      {/* Verification Alert */}
      {rejectedCount > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-4 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>You have {rejectedCount} submission(s) requiring edits before admin verification.</span>
          </div>
          <Link to="/business/businesses" className="font-bold underline text-rose-800 dark:text-rose-200">Review</Link>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">My Businesses</span>
            <Building2 className="w-4 h-4 text-[#003E83] dark:text-[#60a5fa]" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBusinesses}</p>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{approvedCount} Approved & Active</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          <span className="text-xs text-gray-500 dark:text-zinc-400">Awaiting Admin Verification</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Customer Reviews</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReviews}</p>
          <span className="text-xs text-gray-500 dark:text-zinc-400">Across all profiles</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating}</p>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Out of 5.0 Stars</span>
        </div>
      </div>

      {/* Business Profiles List */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Managed Business Profiles</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Update services, opening hours, gallery, and respond to tourist reviews.</p>
          </div>

          <Link
            to="/business/businesses"
            className="text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <Building2 className="w-10 h-10 text-gray-300 dark:text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">No Businesses Registered Yet</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              Register your restaurant, hotel, tour agency, or activity business to reach tourists.
            </p>
            <Link
              to="/business/businesses/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Business Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map((biz) => {
              const isApproved = biz.verification_status === 'approved';
              const isPending = biz.verification_status === 'pending';
              const isRejected = biz.verification_status === 'rejected';

              return (
                <div
                  key={biz.id}
                  className="p-4 rounded-md border border-gray-200 dark:border-zinc-700/60 bg-gray-50 dark:bg-zinc-800/60 flex flex-col justify-between gap-3 hover:border-[#003E83] dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{biz.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : isPending
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {biz.verification_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">{biz.address || biz.province?.name || 'Cambodia'}</p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{Number(biz.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  {isRejected && biz.rejection_reason && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded text-xs">
                      <span className="font-bold">Rejection Note:</span> {biz.rejection_reason}
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-gray-200/80 dark:border-zinc-700/60 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">{biz.category?.name || 'Tourism'}</span>
                    <Link
                      to={`/business/businesses/${biz.id}`}
                      className="px-3.5 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span>Manage Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
