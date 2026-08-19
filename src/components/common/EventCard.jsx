import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function EventCard({ event, onViewDetails }) {
  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80';
  const status = event.status || event.computed_status || 'Upcoming';

  const statusStyle = status === 'Ongoing'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    : status === 'Upcoming'
    ? 'bg-blue-50 text-[#003E83] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(event);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          <div className="absolute top-2.5 right-2.5 z-10">
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${statusStyle}`}>
              {status}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded bg-gray-900/80 text-white text-[11px] font-medium flex items-center gap-1 backdrop-blur-xs">
            <Calendar className="w-3 h-3" />
            <span>{event.start_date || '2026'}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
            <span className="truncate">{event.location || event.province || 'Cambodia'}</span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-gray-400 dark:text-zinc-500 truncate max-w-[160px]">
          {event.organizer || 'Tourism Festival'}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(event);
          }}
          className="flex items-center gap-1 font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline cursor-pointer"
        >
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
