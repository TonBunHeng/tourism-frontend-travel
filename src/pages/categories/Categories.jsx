import { Loader2 } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import CategoriesHeader from './CategoriesHeader';
import CategoriesGrid from './CategoriesGrid';

export default function Categories() {
  const { categories, loadingGlobal } = useTravel();

  if (loadingGlobal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading tourism categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <CategoriesHeader />
      <CategoriesGrid categories={categories} />
    </div>
  );
}
