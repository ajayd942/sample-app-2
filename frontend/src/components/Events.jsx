import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Calendar } from 'lucide-react';

const EventCard = ({ event, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <div className={`mb-8 flex flex-col md:flex-row md:justify-between md:items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      <div className="hidden md:block w-5/12"></div>
      
      <div className="z-20 flex items-center order-1 bg-wedding-primary shadow-xl w-8 h-8 rounded-full absolute left-4 md:static md:left-auto transform -translate-x-1/2 md:translate-x-0">
        <h1 className="mx-auto font-semibold text-lg text-white">{index + 1}</h1>
      </div>
      
      <div className={`order-1 bg-white rounded-lg shadow-xl w-full md:w-5/12 px-6 py-6 transition-transform hover:scale-105 duration-300 ml-12 md:ml-0 ${isLeft ? 'md:animate-fade-in-right' : 'md:animate-fade-in-left'}`}>
        <h3 className="mb-3 font-bold text-gray-800 text-2xl md:text-3xl font-serif">{event.eventName}</h3>
        
        <div className="flex items-center text-gray-600 mb-2 text-sm">
          <Calendar className="w-4 h-4 mr-2 text-wedding-primary" />
          <span>{new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2 text-sm">
          <Clock className="w-4 h-4 mr-2 text-wedding-primary" />
          <span>{new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="flex items-start text-gray-600 mb-4 text-sm">
          <MapPin className="w-4 h-4 mr-2 mt-1 text-wedding-primary flex-shrink-0" />
          <span>{event.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {event.description}
        </p>

        <a 
          href={event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white text-xs px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse mb-8 flex flex-col md:flex-row md:justify-between md:items-center w-full">
    <div className="hidden md:block w-5/12"></div>
    <div className="z-20 bg-gray-300 w-8 h-8 rounded-full absolute left-4 md:static md:left-auto transform -translate-x-1/2 md:translate-x-0"></div>
    <div className="bg-white rounded-lg shadow-xl w-full md:w-5/12 px-6 py-6 ml-12 md:ml-0">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-20 bg-gray-100 rounded w-full mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/wedding/events');
        // Sort events by start time
        const sortedEvents = response.data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
        // Fallback dummy data for demo if API fails or is empty
        setEvents([
          {
            id: '1',
            eventName: 'Welcome Cocktail',
            startTime: '2026-03-10T19:00:00',
            location: 'The Grand Ballroom, Hotel Taj',
            description: 'Join us for an evening of drinks, music, and dancing to kick off the celebrations!',
            mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76'
          },
          {
            id: '2',
            eventName: 'Haldi Ceremony',
            startTime: '2026-03-11T10:00:00',
            location: 'Poolside, Hotel Taj',
            description: 'A colorful morning filled with turmeric, laughter, and traditional rituals.',
            mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76'
          },
          {
            id: '3',
            eventName: 'The Wedding',
            startTime: '2026-03-11T18:00:00',
            location: 'Sunset Lawns, Hotel Taj',
            description: 'The main ceremony where Ajay & Vandana tie the knot under the stars.',
            mapUrl: 'https://maps.app.goo.gl/ewEG9LSPLN6UZyc76'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-wedding-secondary py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Wedding Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We have planned a series of events to celebrate our union. We would be honored by your presence at each of them.
          </p>
        </div>

        <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
          {/* Vertical Timeline Line */}
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-4 md:left-1/2 top-0"></div>

          {loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
