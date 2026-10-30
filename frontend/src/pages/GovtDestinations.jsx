import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  MapPin,
  TrendingUp,
  Users,
  Compass,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const GovtDestinations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);
        const res = await api.getGovtDestinations();
        setData(res);
        if (res.destinations && res.destinations.length > 0) {
          setSelectedDest(res.destinations[0]);
        }
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Destination Analytics • GK-19</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Travel Destination Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor tourist influx, destination popularity distribution, and traveler volume (GK-19).
          </p>
        </div>

        {data && (
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xl font-black text-slate-900">{data.totalDestinations}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Destinations</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Aggregating destination metrics...</p>
        </div>
      ) : !data || data.destinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No destinations recorded yet</h3>
          <p className="text-xs text-slate-400 mt-1">Submitted trips will populate destination analytics here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Destination Rankings List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Popularity Ranking (GK-19)
            </h2>
            {data.destinations.map((dest, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDest(dest)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  selectedDest?.destination === dest.destination
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`h-7 w-7 rounded-lg font-black text-xs flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' :
                    idx === 1 ? 'bg-slate-200 text-slate-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{dest.destination}</h3>
                    <p className="text-xs text-slate-400">
                      {dest.totalTrips} Trip{dest.totalTrips === 1 ? '' : 's'} • {dest.uniqueTravelers} Traveler{dest.uniqueTravelers === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>

          {/* Detailed Destination Drilldown */}
          <div className="lg:col-span-2">
            {selectedDest ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
                {/* Visual Cover */}
                <div className="relative h-56 w-full bg-slate-100">
                  <img
                    src={selectedDest.sampleImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                    alt={selectedDest.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="inline-flex items-center space-x-1 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Monitored Destination</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">{selectedDest.destination}</h2>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="px-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Trips</p>
                    <p className="text-xl font-black text-indigo-700 mt-1">{selectedDest.totalTrips}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Unique Travelers</p>
                    <p className="text-xl font-black text-sky-700 mt-1">{selectedDest.uniqueTravelers}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Places Monitored</p>
                    <p className="text-xl font-black text-emerald-700 mt-1">{selectedDest.placesCount}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Logged Photos</p>
                    <p className="text-xl font-black text-purple-700 mt-1">{selectedDest.photosCount}</p>
                  </div>
                </div>

                {/* Registered Trips under this destination */}
                <div className="px-6 pb-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Registered Itineraries in {selectedDest.destination}
                  </h3>
                  <div className="space-y-2">
                    {selectedDest.trips?.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.title}</p>
                          <p className="text-slate-500 mt-0.5">
                            Traveler: <span className="font-semibold text-slate-700">{t.travelerName}</span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{t.startDate} → {t.endDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Select a destination from the list</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
