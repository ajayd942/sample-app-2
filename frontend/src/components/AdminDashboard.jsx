import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, RefreshCw, Plus, Calendar, MapPin, Clock, FileText, Trash2, Edit, X, Link as LinkIcon, ArrowUp, ArrowDown, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('RSVPs');
  const [rsvpList, setRsvpList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    location: '',
    startTime: '',
    description: '',
    mapUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingGuest, setEditingGuest] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/admin/rsvps', {
        headers: { 'X-Admin-Secret': secret }
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setRsvpList(response.data);
        fetchEvents();
      }
    } catch (err) {
      setError('Invalid Secret. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/rsvps', {
        headers: { 'X-Admin-Secret': secret }
      });
      setRsvpList(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/admin/events', {
        headers: { 'X-Admin-Secret': secret }
      });
      // Sort events by displayOrder if available, otherwise by startTime
      const sortedEvents = response.data.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
              return a.displayOrder - b.displayOrder;
          }
          return new Date(a.startTime) - new Date(b.startTime);
      });
      setEventsList(sortedEvents);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'Events') {
      fetchEvents();
    }
  }, [isAuthenticated, activeTab]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setError('');
    
    const formattedEvent = {
        ...newEvent,
        startTime: new Date(newEvent.startTime).toISOString()
    };

    try {
      await axios.post('/api/admin/events', formattedEvent, {
        headers: { 'X-Admin-Secret': secret }
      });
      setSuccessMsg('Event added successfully!');
      setNewEvent({ eventName: '', location: '', startTime: '', description: '', mapUrl: '' });
      fetchEvents(); // Refresh list
    } catch (err) {
      setError('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/admin/events/${id}`, {
          headers: { 'X-Admin-Secret': secret }
        });
        setEventsList(eventsList.filter(event => event.id !== id));
      } catch (err) {
        console.error('Failed to delete event', err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleMoveEvent = async (index, direction) => {
    const newEvents = [...eventsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newEvents.length) return;

    // Swap
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    setEventsList(newEvents); // Optimistic update

    const eventIds = newEvents.map(e => e.id);
    try {
      await axios.put('/api/admin/events/reorder', eventIds, {
        headers: { 'X-Admin-Secret': secret }
      });
    } catch (err) {
      console.error('Failed to reorder events', err);
      fetchEvents(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this RSVP?')) {
      try {
        await axios.delete(`/api/admin/rsvps/${id}`, {
          headers: { 'X-Admin-Secret': secret }
        });
        setRsvpList(rsvpList.filter(guest => guest.id !== id));
      } catch (err) {
        console.error('Failed to delete RSVP', err);
        alert('Failed to delete RSVP. Please try again.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/rsvps/${editingGuest.id}`, editingGuest, {
        headers: { 'X-Admin-Secret': secret }
      });
      setRsvpList(rsvpList.map(guest => guest.id === editingGuest.id ? response.data : guest));
      setEditingGuest(null);
    } catch (err) {
      console.error('Failed to update RSVP', err);
      alert('Failed to update RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 p-4 rounded-full">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                placeholder="Enter admin secret"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/admin/logs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-wedding-primary font-medium transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" />
              System Logs
            </a>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('RSVPs')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'RSVPs'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            View RSVPs
          </button>
          <button
            onClick={() => setActiveTab('Events')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'Events'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Manage Events
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[500px]">
          {activeTab === 'RSVPs' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Guest List</h2>
                <button
                  onClick={fetchRsvps}
                  className="flex items-center text-gray-600 hover:text-wedding-primary transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Guest Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-center">Guests</th>
                      <th className="p-4 font-semibold text-center">Cab?</th>
                      <th className="p-4 font-semibold text-center">Created</th>
                      <th className="p-4 font-semibold text-center">Updated</th>
                      <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rsvpList.length > 0 ? (
                      rsvpList.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{guest.fullName}</td>
                          <td className="p-4 text-gray-600">{guest.email}</td>
                          <td className="p-4 text-gray-600">{guest.phoneNumber || '-'}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              guest.rsvpStatus === 'ATTENDING' 
                                ? 'bg-green-100 text-green-800' 
                                : guest.rsvpStatus === 'NOT_ATTENDING'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {guest.rsvpStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center text-gray-600">{guest.guestCount}</td>
                          <td className="p-4 text-center">
                            {guest.needsCab ? (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center text-gray-500 text-sm">{formatDate(guest.createdAt)}</td>
                          <td className="p-4 text-center text-gray-500 text-sm">{formatDate(guest.updatedAt)}</td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button 
                                onClick={() => setEditingGuest(guest)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(guest.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-gray-500">
                          No RSVPs received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-10 max-w-2xl mx-auto">
              {/* Event List */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Existing Events</h2>
                <div className="space-y-4">
                  {eventsList.map((event, index) => (
                    <div key={event.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200">
                      <div>
                        <h3 className="font-bold text-gray-900">{event.eventName}</h3>
                        <p className="text-sm text-gray-600">{formatDate(event.startTime)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveEvent(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleMoveEvent(index, 'down')}
                          disabled={index === eventsList.length - 1}
                          className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {eventsList.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No events added yet.</p>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-6 border-t pt-8">Add New Event</h2>
              
              {successMsg && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-200">
                  {successMsg}
                </div>
              )}
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newEvent.eventName}
                      onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                      placeholder="e.g. Sangeet Night"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                        placeholder="e.g. Grand Ballroom"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={newEvent.mapUrl}
                      onChange={(e) => setNewEvent({...newEvent, mapUrl: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none resize-none"
                    placeholder="Describe the event..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wedding-primary text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-md flex items-center justify-center"
                >
                  {loading ? 'Saving...' : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Event
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Edit Guest</h3>
              <button onClick={() => setEditingGuest(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingGuest.fullName}
                  onChange={(e) => setEditingGuest({...editingGuest, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingGuest.email}
                  onChange={(e) => setEditingGuest({...editingGuest, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingGuest.phoneNumber || ''}
                  onChange={(e) => setEditingGuest({...editingGuest, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RSVP Status</label>
                <select
                  value={editingGuest.rsvpStatus}
                  onChange={(e) => setEditingGuest({...editingGuest, rsvpStatus: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ATTENDING">Attending</option>
                  <option value="NOT_ATTENDING">Not Attending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingGuest.guestCount || 1}
                  onChange={(e) => setEditingGuest({...editingGuest, guestCount: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editNeedsCab"
                  checked={editingGuest.needsCab}
                  onChange={(e) => setEditingGuest({...editingGuest, needsCab: e.target.checked})}
                  className="w-4 h-4 text-wedding-primary border-gray-300 rounded focus:ring-wedding-primary"
                />
                <label htmlFor="editNeedsCab" className="ml-2 block text-sm text-gray-700">
                  Needs Cab
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-wedding-primary text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
