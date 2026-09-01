import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Briefcase, Loader2 } from 'lucide-react';
import businessService from '../../services/businessService';
import provinceService from '../../services/provinceService';
import categoryService from '../../services/categoryService';
import BusinessCard from '../../components/common/BusinessCard';

export default function Businesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province_id') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price_range') || '');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [provRes, catRes] = await Promise.all([
          provinceService.getProvinces().catch(() => ({ data: [] })),
          categoryService.getCategories().catch(() => ({ data: [] })),
        ]);
        setProvinces(provRes?.data || provRes || []);
        setCategories(catRes?.data || catRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedProvince) params.province_id = selectedProvince;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedPrice) params.price_range = selectedPrice;
      if (sort) params.sort = sort;

      const res = await businessService.getBusinesses(params);
      const list = res?.data?.businesses || res?.data || res || [];
      setBusinesses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to load tourism businesses.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedProvince, selectedCategory, selectedPrice, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedProvince('');
    setSelectedCategory('');
    setSelectedPrice('');
    setSort('latest');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Simple Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Local Tourism Businesses
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Discover verified hotels, dining, tours, and hospitality services across Cambodia
            </p>
          </div>
          <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
            Total: {businesses.length} businesses
          </span>
        </div>

        {/* Simple Filter Toolbar */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3.5 shadow-xs space-y-3 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                className="w-full pl-7 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none cursor-pointer"
              >
                <option value="">All Provinces</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none cursor-pointer"
              >
                <option value="">All Price Ranges</option>
                <option value="$">$ Budget</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Luxury</option>
                <option value="$$$$">$$$$ Premium</option>
              </select>
            </div>

            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none cursor-pointer"
              >
                <option value="latest">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Reviewed</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#003E83] dark:text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Fetching verified businesses...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-2xl border border-rose-200 dark:border-rose-900 text-center">
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={fetchBusinesses}
              className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-gray-200 dark:border-zinc-800 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Businesses Found</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              We couldn't find any business matching your search filter. Try clearing filters or searching for another location.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#003E83] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
