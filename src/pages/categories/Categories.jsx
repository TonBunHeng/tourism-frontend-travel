import { useTravel } from '../../context/TravelContext';
import CategoriesHeader from './CategoriesHeader';
import CategoriesGrid from './CategoriesGrid';

export default function Categories() {
  const { categories } = useTravel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <CategoriesHeader />
      <CategoriesGrid categories={categories} />
    </div>
  );
}
