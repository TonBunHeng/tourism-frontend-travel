import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import ProvincesHeader from './ProvincesHeader';
import ProvincesGrid from './ProvincesGrid';

export default function Provinces() {
  const { provinces, loadingGlobal } = useTravel();
  const [search, setSearch] = useState('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ProvincesHeader search={search} setSearch={setSearch} />
      <ProvincesGrid provinces={filtered} />
    </div>
  );
}
