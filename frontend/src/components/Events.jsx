import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Calendar, ExternalLink } from 'lucide-react';

const EventCard = ({ event, index }) => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  return (
    <div className="glass-card border-l-2 border-l-wedding-primary/50 p-8 md:p-10 mb-8 transition-all duration-400 hover:-translate-y-1 hover:border-l-wedding-primary group">
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
        {/* Roman numeral */}
        <div className="flex-shrink-0">
          <span className="font-serif text-5xl md:text-6xl font-light text-wedding-primary/20 group-hover:text-wedding-primary/40 transition-colors leading-none">
            {romanNumerals[index] || index + 1}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-serif text-3xl md:text-4xl font-light text-wedding-blush mb-4 leading-snug">
            {event.eventName}
          </h3>

          <div className="divider-gold w-10 mb-5 opacity-40" />

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3 text-wedding-blush/50 text-sm font-sans">
              <Calendar className="w-4 h-4 text-wedding-primary/60 flex-shrink-0" />
              <span>
                {new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-wedding-blush/50 text-sm font-sans">
              <Clock className="w-4 h-4 text-wedding-primary/60 flex-shrink-0" />
              <span>
                {new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-start gap-3 text-wedding-blush/50 text-sm font-sans">
              <MapPin className="w-4 h-4 text-wedding-primary/60 flex-shrink-0 mt-0.5" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="font-sans text-sm leading-loose text-wedding-blush/50 mb-6">
            {event.description}
          </p>

          <a
            href={event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-wedding-primary border border-wedding-primary/40 px-5 py-2.5 hover:bg-wedding-primary hover:text-wedding-dark transition-all duration-300 font-sans group/btn"
          >
            Get Directions
            <ExternalLink size={11} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="glass-card p-8 md:p-10 mb-8 animate-pulse">
    <div className="flex gap-10">
      <div className="w-12 h-14 bg-white/5 rounded" />
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-white/5 rounded w-2/3" />
        <div className="h-px bg-white/5 w-10" />
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-4 bg-white/5 rounded w-2/5" />
        </div>
        <div className="h-16 bg-white/5 rounded w-full" />
        <div className="h-9 bg-white/5 rounded w-32" />
      </div>
    </div>
  </div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/wedding/events');
        const sorted = response.data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        setEvents(sorted);
      } catch {
        setEvents([
          { id: '1', eventName: 'Welcome Cocktail', startTime: '2026-03-10T19:00:00', location: 'Happy Retreats - KAI', description: 'Join us for an evening of drinks, music, and dancing to kick off the celebrations!', mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76' },
          { id: '2', eventName: 'Haldi Ceremony', startTime: '2026-03-11T10:00:00', location: 'Happy Retreats - KAI', description: 'A colorful morning filled with turmeric, laughter, and traditional rituals.', mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76' },
          { id: '3', eventName: 'The Wedding', startTime: '2026-03-11T18:00:00', location: 'Happy Retreats - KAI', description: 'The main ceremony where Ajay & Vandana tie the knot under the stars.', mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-wedding-dark py-28 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-wedding-primary/60 mb-6">
            Join us for
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-wedding-blush mb-6 leading-none">
            The Events
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6 opacity-50" />
          <p className="font-sans text-sm text-wedding-blush/50 max-w-xl mx-auto leading-relaxed">
            We have planned a series of celebrations. We would be honoured by your presence at each of them.
          </p>
        </div>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
