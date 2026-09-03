import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, ChevronRight, Loader2, Building2 } from 'lucide-react';
import businessService from '../../services/businessService';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await businessService.getOwnerBusinesses();
        const list = res?.data?.businesses || res?.data || res || [];
        setBusinesses(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading your business directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Business Portal', to: '/business/dashboard' },
          { label: 'My Businesses' }
        ]}
      />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Registered Businesses</h1>
        </div>

        <Link
          to="/business/businesses/new"
          className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Business</span>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-12 text-center space-y-3">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Businesses Registered</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            You have not registered any business profile yet. Register your business to start managing your listings and reviews.
          </p>
          <Link
            to="/business/businesses/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Business</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => {
            const isApproved = biz.verification_status === 'approved';
            const isPending = biz.verification_status === 'pending';

            return (
              <div key={biz.id} className="p-5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between gap-4 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{biz.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{biz.address || biz.province?.name || 'Cambodia'}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ${
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

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">{biz.category?.name || 'Tourism'}</span>
                  <Link
                    to={`/business/businesses/${biz.id}`}
                    className="px-3 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1"
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
  );
}
