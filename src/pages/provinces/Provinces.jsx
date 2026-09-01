import { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import ProvincesHeader from './ProvincesHeader';
import ProvincesGrid from './ProvincesGrid';

export default function Provinces() {
  const { provinces } = useTravel();
  const [search, setSearch] = useState('');

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
