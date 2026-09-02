import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Landmark, Trees, Waves, Castle, Utensils } from 'lucide-react';

const categoryIcons = {
  'Historical Temples': Landmark,
  'Nature & Eco-tourism': Trees,
  'Beaches & Islands': Waves,
  'Cultural Heritage': Castle,
  'Culinary & Street Food': Utensils,
};

export default function CategoriesGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.name] || Sparkles;

        return (
          <Link
            key={cat.id}
            to={`/places?category_id=${cat.id}`}
            className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {cat.description || 'Browse destinations listed under this category.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-[#003E83] dark:text-[#60a5fa]">
              <span>{cat.places_count || 0} Registered Destinations</span>
              <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
