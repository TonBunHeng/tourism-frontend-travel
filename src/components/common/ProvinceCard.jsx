import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react';

const ProvinceCard = ({ province }) => {
  const mapQuery = encodeURIComponent(`${province.name}, Cambodia`);
  const embedMapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Google Map Embedded Frame */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-800">
          <iframe
            title={`Map of ${province.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={embedMapUrl}
            className="w-full h-full"
          />

          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-white/95 dark:bg-zinc-900/95 text-gray-800 dark:text-zinc-200 shadow-xs border border-gray-200 dark:border-zinc-700">
              {province.type || 'Province'}
            </span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 z-10 px-2 py-0.5 text-[10px] font-semibold rounded bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 shadow-xs border border-gray-200 dark:border-zinc-700 flex items-center gap-1 transition-colors"
            title="Open in Google Maps"
          >
            <MapPin className="w-3 h-3 text-[#003E83] dark:text-[#60a5fa]" />
            <span>Open Map</span>
            <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
          </a>
        </div>

        {/* Province Information */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa]" />
            <span>Kingdom of Cambodia</span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors">
            {province.name}
          </h3>

          {province.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {province.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-400">
            {province.population && (
              <div>
                <span className="text-gray-400 dark:text-zinc-500 block">Population</span>
                <span className="font-semibold text-gray-700 dark:text-zinc-300">{province.population}</span>
              </div>
            )}
            {province.area && (
              <div>
                <span className="text-gray-400 dark:text-zinc-500 block">Area</span>
                <span className="font-semibold text-gray-700 dark:text-zinc-300">{province.area}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium bg-gray-50/50 dark:bg-zinc-800/30">
        <span className="text-gray-500 dark:text-zinc-400">
          {province.places_count || 0} Registered Attractions
        </span>
        <Link
          to={`/places?province_id=${province.id}`}
          className="flex items-center gap-1 font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          Explore Places <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ProvinceCard;
