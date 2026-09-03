import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { eventService } from '../../services/eventService';
import EventsHeader from './EventsHeader';
import EventsGrid from './EventsGrid';
import EventDetailsModal from './EventDetailsModal';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Events() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    setStatusFilter(searchParams.get('status') || 'All');
    setSearch(searchParams.get('search') || '');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = { per_page: 4, page };
        if (statusFilter !== 'All') params.status = statusFilter;
        if (search.trim()) params.search = search.trim();

        const res = await eventService.getEvents(params);
        if (res?.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.data || [];
          setEvents(list);
          setPagination(res.meta || null);

          // If URL has an event ID, find it or fetch it
          if (id) {
            const found = list.find((e) => String(e.id) === String(id));
            if (found) {
              setSelectedEvent(found);
              setIsDetailsOpen(true);
            } else {
              try {
                const singleRes = await eventService.getEventById(id);
                if (singleRes?.data) {
                  setSelectedEvent(singleRes.data);
                  setIsDetailsOpen(true);
                }
              } catch (e) {
                console.error('Failed to load event by id', e);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [statusFilter, search, page, id]);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (newStatus !== 'All') {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('search', val.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const isServerPaginated = Boolean(pagination && pagination.last_page);
  const totalPages = isServerPaginated ? pagination.last_page : (Math.ceil(events.length / 4) || 1);
  const currentPage = isServerPaginated ? (pagination.current_page || page) : Math.min(Math.max(1, page), totalPages);

  const displayedEvents = isServerPaginated
    ? events
    : events.slice((currentPage - 1) * 4, currentPage * 4);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const p = new URLSearchParams(searchParams);
    p.set('page', String(newPage));
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedEvent(null);
    if (id) {
      navigate('/events', { replace: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Events & Festivals' }]} />
      <EventsHeader
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        search={search}
        setSearch={handleSearchChange}
      />

      <EventsGrid
        events={displayedEvents}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 px-3 py-1 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <EventDetailsModal
        isOpen={isDetailsOpen}
        event={selectedEvent}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
