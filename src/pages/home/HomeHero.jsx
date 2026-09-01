import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Compass } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function HomeHero() {
  const navigate = useNavigate();
  const { categories, provinces } = useTravel();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (selectedProvinceId) params.append('province_id', selectedProvinceId);
    if (selectedCategoryId) params.append('category_id', selectedCategoryId);
    navigate(`/places?${params.toString()}`);
  };

  return (
    <section className="bg-[#003E83] dark:bg-[#00244d] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#002e62] dark:border-zinc-800 transition-colors">
      <div className="max-w-5xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-white text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          Kingdom of Cambodia • AngkorVerses
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
          Discover Heritage Sites & Attractions
        </h1>

        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          Explore ancient temples, coastal islands, and cultural festivals across all 25 provinces.
        </p>

        {/* Search Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-2.5 sm:p-3 max-w-3xl mx-auto shadow-md border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-left transition-colors">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center">
            <div className="sm:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destination, temple, city..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              >
                <option value="">All Provinces (25)</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-1.5 px-4 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer text-center"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs max-w-full px-2">
          <span className="text-blue-200 mr-1 shrink-0">Popular:</span>
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              to={`/places?category_id=${cat.id}`}
              className="px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
