import { X, Calendar, Clock, MapPin, Users, Building, ExternalLink } from 'lucide-react';

export default function EventDetailsModal({ isOpen, event, onClose }) {
  if (!isOpen || !event) return null;

  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80';
  const status = event.status || event.computed_status || 'Upcoming';

  const statusColor = status === 'Ongoing'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
    : status === 'Upcoming'
    ? 'bg-blue-50 text-[#003E83] border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
    : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';

  const mapQuery = encodeURIComponent(`${event.location || event.province || event.title}, Cambodia`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden my-8 zoom-in transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60">
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Festival & Event Info</span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Cover Picture */}
          <div className="relative aspect-16/9 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800">
            <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute top-2.5 right-2.5">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border shadow-xs ${statusColor}`}>
                {status}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{event.title}</h2>
            <p className="text-xs text-gray-600 dark:text-zinc-300 mt-1 leading-relaxed whitespace-pre-line">
              {event.description || 'Join celebrations and experience traditional cultural performances.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">Start Date</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-zinc-200">
                <Calendar className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa]" />
                <span>{event.start_date || 'TBD'}</span>
              </div>
            </div>

            <div className="p-3 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">End Date</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-zinc-200">
                <Clock className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa]" />
                <span>{event.end_date || 'TBD'}</span>
              </div>
            </div>

            <div className="p-3 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">Organizer</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-zinc-200 truncate">
                <Building className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
                <span className="truncate">{event.organizer || 'Ministry of Tourism'}</span>
              </div>
            </div>

            <div className="p-3 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">Expected Visitors</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-zinc-200">
                <Users className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa]" />
                <span>{event.expected_attendees ? event.expected_attendees.toLocaleString() : 'Open to Public'}</span>
              </div>
            </div>
          </div>

          {/* Location Bar */}
          <div className="p-3 rounded-md bg-blue-50 dark:bg-zinc-800/60 border border-blue-200 dark:border-zinc-700 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white block text-xs">Event Location</span>
                <span className="text-gray-600 dark:text-zinc-300 text-[11px]">{event.location || event.province || 'Cambodia'}</span>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-[11px] font-semibold rounded flex items-center gap-1 shrink-0 transition-colors"
            >
              Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
