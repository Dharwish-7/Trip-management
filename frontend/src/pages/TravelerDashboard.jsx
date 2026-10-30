import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TripCard } from '../components/TripCard';
import {
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

export const TravelerDashboard = ({ onSelectTrip, onOpenCreateTrip }) => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all'); // all, draft, submitted
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMyTrips();
      setTrips(data);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary? (GK-14)')) {
      return;
    }
    try {
      await api.deleteTrip(id);
      setSuccessMsg('Trip deleted successfully (GK-14).');
      loadTrips();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete trip');
    }
  };

  const handleSubmitTrip = async (trip) => {
    if (!window.confirm(`Are you ready to finalize and submit "${trip.title}" to government authorities? (GK-12)`)) {
      return;
    }
    try {
      await api.submitTrip(trip.id);
      setSuccessMsg(`"${trip.title}" has been officially submitted for government audit & record keeping! (GK-12)`);
      loadTrips();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      alert(err.message || 'Submission failed. Ensure you have added at least one place.');
    }
  };

  const filteredTrips = trips.filter(t => {
    if (filter === 'draft') return t.status === 'Draft';
    if (filter === 'submitted') return t.status === 'Submitted';
    return true;
  });

  const draftCount = trips.filter(t => t.status === 'Draft').length;
  const submittedCount = trips.filter(t => t.status === 'Submitted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner / Greeting */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
            <Compass className="h-3.5 w-3.5" />
            <span>Traveler Space • GK Sprints 1, 2, 3</span>
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Travel Journeys & Records
          </h1>
          <p className="mt-2 text-sky-100 text-sm sm:text-base">
            Create travel plans (GK-8), log visited landmarks (GK-9), attach descriptions & photos (GK-10), and submit records to the government (GK-12).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateTrip}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-sm shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Trip (GK-8)</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
          <Compass className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filter === 'all'
              ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Itineraries</span>
            <FolderOpen className="h-5 w-5 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{trips.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total recorded journeys</p>
        </div>

        <div
          onClick={() => setFilter('draft')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filter === 'draft'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Draft Trips (In Progress)</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{draftCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending places / submission</p>
        </div>

        <div
          onClick={() => setFilter('submitted')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filter === 'submitted'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Previous Trips (GK-13)</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{submittedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Officially submitted & verified</p>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {filter === 'submitted' ? 'Previous & Submitted Trips (GK-13)' : filter === 'draft' ? 'Draft Itineraries in Progress' : 'All Travel Journeys'}
          </h2>
          <p className="text-xs text-slate-500">
            Showing {filteredTrips.length} record{filteredTrips.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'draft' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'submitted' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submitted (GK-13)
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading your travel records...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Compass className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No trips found in this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter === 'submitted'
              ? 'You have not submitted any trips yet. Add visited places to a draft trip and click Submit!'
              : 'Start your journey by creating your first trip itinerary.'}
          </p>
          <button
            onClick={onOpenCreateTrip}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Trip (GK-8)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onSelect={onSelectTrip}
              onDelete={handleDeleteTrip}
              onSubmit={handleSubmitTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
