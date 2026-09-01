import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import EventsHeader from './EventsHeader';
import EventsGrid from './EventsGrid';
import EventDetailsModal from './EventDetailsModal';

export default function Events() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter !== 'All') params.status = statusFilter;
        if (search.trim()) params.search = search.trim();

        const res = await eventService.getEvents(params);
        if (res?.data) {
          setEvents(res.data);

          // If URL has an event ID, find it or fetch it
          if (id) {
            const found = res.data.find((e) => String(e.id) === String(id));
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
  }, [statusFilter, search, id]);

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
      <EventsHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
      />

      <EventsGrid
        events={events}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        event={selectedEvent}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
