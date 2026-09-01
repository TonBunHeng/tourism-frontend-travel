import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import businessService from '../../services/businessService';

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
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading your business directory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div>
            <Link to="/business/dashboard" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Registered Businesses</h1>
          </div>

          <Link
            to="/business/businesses/new"
            className="px-4 py-2.5 bg-[#003E83] hover:bg-[#002e62] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Business
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <div key={biz.id} className="p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{biz.name}</h3>
                  <p className="text-xs text-gray-500">{biz.address || biz.province?.name}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {biz.verification_status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-xs text-gray-400 font-semibold">{biz.category?.name}</span>
                <Link
                  to={`/business/businesses/${biz.id}`}
                  className="px-3 py-1.5 bg-[#003E83] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
