import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Landmark, 
  Trees, 
  Waves, 
  Castle, 
  Utensils,
  Compass,
  Building2,
  Camera
} from 'lucide-react';

const categoryIcons = {
  'Historical Temples': Landmark,
  'Nature & Eco-tourism': Trees,
  'Beaches & Islands': Waves,
  'Cultural Heritage': Castle,
  'Culinary & Street Food': Utensils,
  'Hotels & Resorts': Building2,
  'Photography & Scenery': Camera,
};

const categoryGradients = {
  'Historical Temples': 'from-amber-500/10 via-amber-500/5 to-transparent',
  'Nature & Eco-tourism': 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  'Beaches & Islands': 'from-sky-500/10 via-sky-500/5 to-transparent',
  'Cultural Heritage': 'from-indigo-500/10 via-indigo-500/5 to-transparent',
  'Culinary & Street Food': 'from-rose-500/10 via-rose-500/5 to-transparent',
};

export default function CategoriesGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.name] || Sparkles;
        const gradient = categoryGradients[cat.name] || 'from-blue-500/10 via-blue-500/5 to-transparent';

        return (
          <Link
            key={cat.id}
            to={`/places?category_id=${cat.id}`}
            className="modern-card group relative bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-bl-full pointer-events-none transition-transform group-hover:scale-125`} />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#003E83] dark:text-blue-400 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 group-hover:bg-[#003E83] group-hover:text-white transition-all">
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {cat.description || 'Explore authentic Cambodian destinations and activities categorized under this theme.'}
              </p>
            </div>

            <div className="relative z-10 pt-5 mt-5 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-[#003E83] dark:text-blue-400">
              <span className="text-[11px] text-gray-400 font-semibold">
                {cat.places_count || 0} Attractions
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
