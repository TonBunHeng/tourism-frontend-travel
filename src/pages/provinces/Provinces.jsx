import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import ProvincesHeader from './ProvincesHeader';
import ProvincesGrid from './ProvincesGrid';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Provinces() {
  const { provinces, loadingGlobal } = useTravel();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  if (loadingGlobal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading Cambodia 25 provinces...</p>
      </div>
    );
  }

  const filtered = provinces.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedProvinces = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Provinces' }]} />
      <ProvincesHeader search={search} setSearch={handleSearchChange} />
      <ProvincesGrid provinces={paginatedProvinces} />

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
    </div>
  );
}
