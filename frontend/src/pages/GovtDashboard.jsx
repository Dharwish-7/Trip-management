import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Eye,
  FileCheck2,
  DollarSign,
  Download,
  X,
  Compass,
  Image as ImageIcon
} from 'lucide-react';

export const GovtDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsData, statsData] = await Promise.all([
        api.getGovtTrips({
          search,
          destination: destinationFilter,
          startDate,
          endDate
        }),
        api.getGovtStats()
      ]);
      setTrips(tripsData.trips || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load government data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [destinationFilter, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setDestinationFilter('');
    setStartDate('');
    setEndDate('');
    setTimeout(loadData, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Government Travel Data Authority • GK Sprints 3 & 4</span>
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Submitted Travel Records Audit
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Official central registry to view submitted trip details (GK-16), apply cross-traveler search & filters (GK-17), and review verified tourist itineraries.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Submitted Trips</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalSubmittedTrips}</p>
            <p className="text-xs text-slate-400 mt-0.5">Compliant & verified</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">Monitored Destinations</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.uniqueDestinationsCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Across registered itineraries</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Visited Waypoints</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalMonitoredPlaces}</p>
            <p className="text-xs text-slate-400 mt-0.5">Tracked tourist places</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Logged Photos</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalMonitoredPhotos}</p>
            <p className="text-xs text-slate-400 mt-0.5">Audited image files</p>
          </div>
        </div>
      )}

      {/* GK-17: Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Search & Filter Records (GK-17)</span>
          </div>

          {(search || destinationFilter || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search traveler, title, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Destination Filter */}
          <div className="relative">
            <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Destination (e.g. Kyoto)..."
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Start Date */}
          <div className="relative">
            <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              title="Travel active from"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Apply Search</span>
          </button>
        </form>
      </div>

      {/* GK-16: Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Submitted Trip Records (GK-16)
            </h2>
            <p className="text-xs text-slate-500">
              Showing {trips.length} verified traveler submissions
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-3 text-sm text-slate-500">Retrieving official records...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No submitted records matched your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try modifying your search or clearing date filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Traveler Name</th>
                  <th className="px-6 py-3.5">Destination & Title</th>
                  <th className="px-6 py-3.5">Travel Dates</th>
                  <th className="px-6 py-3.5">Itinerary Highlights</th>
                  <th className="px-6 py-3.5">Submitted On</th>
                  <th className="px-6 py-3.5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-indigo-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {t.travelerName ? t.travelerName.charAt(0) : 'T'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{t.travelerName}</p>
                          <p className="text-[11px] text-slate-400">{t.travelerEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                        <span>{t.destination}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.title}</p>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-slate-800">{t.startDate}</p>
                      <p className="text-slate-400">to {t.endDate}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          <Compass className="h-3 w-3" />
                          <span>{t.places?.length || 0} places</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                          <ImageIcon className="h-3 w-3" />
                          <span>{t.photos?.length || 0} photos</span>
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(t.submittedAt || t.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTrip(t)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect (GK-16)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GK-16: Official Inspection Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Travel Audit File (GK-16)
                  </h3>
                  <p className="text-xs text-slate-500">Record ID: {selectedTrip.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Traveler & Destination Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <div>
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Traveler Profile</p>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{selectedTrip.travelerName}</p>
                  <p className="text-slate-500">{selectedTrip.travelerEmail}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Destination</p>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{selectedTrip.destination}</p>
                  <p className="text-slate-500">{selectedTrip.startDate} → {selectedTrip.endDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-bold text-[10px]">Submission Timestamp</p>
                  <p className="font-bold text-emerald-700 mt-0.5 text-sm">Verified Submitted</p>
                  <p className="text-slate-500">{new Date(selectedTrip.submittedAt || selectedTrip.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Trip Narrative */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Trip Narrative & Purpose
                </h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedTrip.description || selectedTrip.purpose || 'No narrative provided.'}
                </p>
              </div>

              {/* Visited Places */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Registered Visited Places ({selectedTrip.places?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedTrip.places?.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-slate-400">{p.location} • Visited on {p.visitDate}</p>
                        {p.notes && <p className="text-slate-600 mt-1 italic">"{p.notes}"</p>}
                      </div>
                      <span className="text-amber-500 font-bold">
                        {'★'.repeat(p.rating || 5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Photos */}
              {selectedTrip.photos && selectedTrip.photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Attached Photographic Evidence (GK-21)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedTrip.photos.map((ph, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={ph.url} alt={ph.caption} className="h-32 w-full object-cover" />
                        <div className="p-2 bg-slate-50 text-[11px] text-slate-700">
                          <p className="font-semibold line-clamp-1">{ph.caption}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ph.placeName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Government Traveler Compliance Verified</span>
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
