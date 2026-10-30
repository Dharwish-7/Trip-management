import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Calendar,
  Users,
  MapPin,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const GovtActivityDate = () => {
  const [targetDate, setTargetDate] = useState('2026-10-16');
  const [singleDateData, setSingleDateData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data for target date + monthly overview
  const fetchData = async (date) => {
    try {
      setLoading(true);
      const [dateRes, timelineRes] = await Promise.all([
        api.getGovtActivityByDate({ targetDate: date }),
        api.getGovtActivityByDate({ startDate: '2026-10-01', endDate: '2026-10-31' })
      ]);
      setSingleDateData(dateRes);
      setTimelineData(timelineRes);
    } catch (err) {
      console.error('Failed to fetch activity by date:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(targetDate);
  }, [targetDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Temporal Travel Oversight • GK-20</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Travel Activity by Date
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Inspect active tourist movement and daily itinerary density on specific dates (GK-20).
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Audit Date:</span>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Scanning date-based travel activity...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Target Date Focus Card */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Target Date Summary
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {new Date(targetDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                  <p className="text-xs font-bold text-indigo-200 uppercase">Active Trips</p>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {singleDateData?.activeTripsCount || 0}
                  </p>
                </div>

                <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                  <p className="text-xs font-bold text-purple-200 uppercase">Active Citizens</p>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {singleDateData?.activeTravelersCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Trips on targetDate */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Active Itineraries on {targetDate}
              </h3>
              {(!singleDateData?.activeTrips || singleDateData.activeTrips.length === 0) ? (
                <p className="text-xs text-indigo-200/70 italic">No registered travelers active on this specific date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {singleDateData.activeTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs text-white"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">{trip.title}</p>
                          <div className="flex items-center space-x-1.5 text-indigo-200 mt-1">
                            <MapPin className="h-3 w-3 text-sky-400" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          Active Journey
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-indigo-200">
                        <span>Traveler: <strong className="text-white">{trip.travelerName}</strong></span>
                        <span>{trip.startDate} to {trip.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sights visited specifically on this date */}
            {singleDateData?.activePlaces && singleDateData.activePlaces.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Places Logged for Visit on {targetDate}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {singleDateData.activePlaces.map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs">
                      <p className="font-bold text-white text-sm">{item.place.name}</p>
                      <p className="text-indigo-200">{item.place.location} • Traveler: {item.travelerName}</p>
                      {item.place.notes && <p className="mt-1 text-slate-300 italic">"{item.place.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline Table across October 2026 */}
          {timelineData && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daily Travel Distribution Timeline (GK-20)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Density and active journeys across the audit period ({timelineData.rangeStart} to {timelineData.rangeEnd})
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Active Trips Count</th>
                      <th className="px-6 py-3">Unique Travelers</th>
                      <th className="px-6 py-3">Active Destinations</th>
                      <th className="px-6 py-3 text-right">Audit Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {timelineData.timeline.map((item) => (
                      <tr
                        key={item.date}
                        className={`hover:bg-indigo-50/40 transition cursor-pointer ${
                          targetDate === item.date ? 'bg-indigo-50/80 font-semibold' : ''
                        }`}
                        onClick={() => setTargetDate(item.date)}
                      >
                        <td className="px-6 py-3 font-bold text-slate-900">{item.date}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              item.activeTrips > 0
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.activeTrips} Active
                          </span>
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-700">{item.uniqueTravelers}</td>
                        <td className="px-6 py-3 text-slate-500">
                          {item.destinations && item.destinations.length > 0
                            ? item.destinations.join(', ')
                            : '—'}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTargetDate(item.date);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Select Date
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
