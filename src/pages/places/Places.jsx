import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { placeService } from '../../services/placeService';
import { useTravel } from '../../context/TravelContext';
import PlacesHeader from './PlacesHeader';
import PlacesToolbar from './PlacesToolbar';
import PlacesGrid from './PlacesGrid';
import Breadcrumb from '../../components/common/Breadcrumb';
import SimplePagination from '../../components/common/SimplePagination';

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { provinces } = useTravel();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [provinceId, setProvinceId] = useState(searchParams.get('province_id') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'popular');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentProvince = provinces?.find((p) => String(p.id) === String(provinceId));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(searchParams.get('search') || '');
    setProvinceId(searchParams.get('province_id') || '');
    setCategoryId(searchParams.get('category_id') || '');
    setMinRating(searchParams.get('min_rating') || '');
    setSortBy(searchParams.get('sort_by') || 'popular');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const params = { per_page: 8, page, sort_by: sortBy };
        if (search.trim()) params.search = search.trim();
        if (provinceId) params.province_id = provinceId;
        if (categoryId) params.category_id = categoryId;
        if (minRating) params.min_rating = minRating;

        const res = await placeService.getPlaces(params);
        if (res?.data) {
          setPlaces(res.data);
          setPagination(res.meta || null);
        }
      } catch (err) {
        console.error('Failed to load places', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [search, provinceId, categoryId, minRating, sortBy, page]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (provinceId) params.set('province_id', provinceId);
    if (categoryId) params.set('category_id', categoryId);
    if (minRating) params.set('min_rating', minRating);
    if (sortBy) params.set('sort_by', sortBy);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearch('');
    setProvinceId('');
    setCategoryId('');
    setMinRating('');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Destinations' }]} />
      <PlacesHeader 
        totalCount={pagination?.total ?? places.length} 
        provinceName={currentProvince?.name}
      />

      <PlacesToolbar
        search={search}
        setSearch={setSearch}
        provinceId={provinceId}
        setProvinceId={setProvinceId}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        minRating={minRating}
        setMinRating={setMinRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onApply={handleApply}
        onClear={handleClear}
        hasFilters={Boolean(search || provinceId || categoryId || minRating)}
      />

      <PlacesGrid places={places} loading={loading} onClearFilters={handleClear} />

      <SimplePagination
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.last_page || 1}
        onPageChange={(newPage) => {
          setPage(newPage);
          const p = new URLSearchParams(searchParams);
          p.set('page', String(newPage));
          setSearchParams(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        startIndex={pagination?.from ? pagination.from - 1 : (page - 1) * (pagination?.per_page || 8)}
        endIndex={pagination?.to || Math.min((page - 1) * (pagination?.per_page || 8) + places.length, pagination?.total || places.length)}
        totalRecords={pagination?.total || places.length}
        label="destinations"
        className="rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs"
      />
    </div>
  );
}
