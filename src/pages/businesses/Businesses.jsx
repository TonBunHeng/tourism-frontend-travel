import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Briefcase, Loader2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import businessService from '../../services/businessService';
import provinceService from '../../services/provinceService';
import categoryService from '../../services/categoryService';
import BusinessCard from '../../components/common/BusinessCard';
import BusinessesHeader from './BusinessesHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

export default function Businesses() {
  const { isBusinessOwner } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const searchParam = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);

  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setSearch(searchParam);
  }

  const selectedProvince = searchParams.get('province_id') || '';
  const selectedCategory = searchParams.get('category_id') || '';
  const selectedPrice = searchParams.get('price_range') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = Number(searchParams.get('page')) || 1;

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
      const params = { per_page: 4, page };
      if (search) params.search = search;
      if (selectedProvince) params.province_id = selectedProvince;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedPrice) params.price_range = selectedPrice;
      if (sort) params.sort = sort;

      const res = await businessService.getBusinesses(params);
      const list = res?.data?.businesses || res?.data || res || [];
      const meta = res?.meta || res?.data?.meta || null;
      setBusinesses(Array.isArray(list) ? list : []);
      setPagination(meta);
    } catch (err) {
      setError(err?.message || 'Failed to load tourism businesses.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedProvince, selectedCategory, selectedPrice, sort, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBusinesses();
  }, [fetchBusinesses]);

  const updateParam = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', search);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const isServerPaginated = Boolean(pagination && pagination.last_page);
  const totalPages = isServerPaginated ? pagination.last_page : (Math.ceil(businesses.length / 4) || 1);
  const currentPage = isServerPaginated ? (pagination.current_page || page) : Math.min(Math.max(1, page), totalPages);

  const displayedBusinesses = isServerPaginated
    ? businesses
    : businesses.slice((currentPage - 1) * 4, currentPage * 4);

  const handlePageChange = (newPage) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', String(newPage));
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Businesses' }]} />
      <BusinessesHeader totalCount={pagination?.total ?? businesses.length} />

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
              onChange={(e) => updateParam('province_id', e.target.value)}
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
              onChange={(e) => updateParam('category_id', e.target.value)}
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
              onChange={(e) => updateParam('price_range', e.target.value)}
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
              onChange={(e) => updateParam('sort', e.target.value)}
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
          <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Fetching verified businesses...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-lg border border-rose-200 dark:border-rose-900 text-center">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={fetchBusinesses}
            className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-md text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : displayedBusinesses.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-lg border border-gray-200 dark:border-zinc-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Businesses Found</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            We couldn't find any business matching your search filter. Try clearing filters or searching for another location.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white text-xs font-semibold rounded-md cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 px-3 py-1 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Register New Business Promo Banner */}
      {isBusinessOwner && (
        <section className="bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Own a Tourism Business in Cambodia?
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                Register your hotel, restaurant, tour agency, or activity to get verified and reach travelers worldwide.
              </p>
            </div>
          </div>
          <Link
            to="/business/businesses/new"
            className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Business</span>
          </Link>
        </section>
      )}
    </div>
  );
}

