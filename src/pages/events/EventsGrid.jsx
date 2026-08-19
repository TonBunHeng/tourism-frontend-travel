import React from 'react';
import EventCard from '../../components/common/EventCard';
import { Calendar } from 'lucide-react';

export default function EventsGrid({ events, loading, onViewDetails }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 transition-colors">
        <Calendar className="w-10 h-10 text-gray-400 dark:text-zinc-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">No events found</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Try choosing another status filter or query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
