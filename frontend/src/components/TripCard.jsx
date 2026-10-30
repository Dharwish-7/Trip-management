import React from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2
} from 'lucide-react';

export const TripCard = ({ trip, onSelect, onDelete, onSubmit }) => {
  const isSubmitted = trip.status === 'Submitted';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Cover Image & Status Badge */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isSubmitted
                ? 'bg-emerald-600/90 text-white'
                : 'bg-amber-500/90 text-white'
            }`}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Submitted</span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>Draft</span>
              </>
            )}
          </span>
        </div>

        {/* Destination Tag */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-white/90 text-xs font-semibold drop-shadow">
          <MapPin className="h-3.5 w-3.5 text-sky-400" />
          <span>{trip.destination}</span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition line-clamp-1">
          {trip.title}
        </h3>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {trip.description || trip.purpose || 'No description provided.'}
        </p>

        {/* Metadata Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{trip.startDate} to {trip.endDate}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            <span>Budget: ${trip.budget?.toLocaleString() || 0}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            <span>{trip.places?.length || 0} Places</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
            <span>{trip.photos?.length || 0} Photos</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onSelect(trip)}
            className="flex items-center space-x-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>{isSubmitted ? 'View Records' : 'Manage & Edit'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2">
            {!isSubmitted && (
              <>
                <button
                  onClick={() => onSubmit(trip)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                  title="Submit trip for government audit"
                >
                  Submit
                </button>
                <button
                  onClick={() => onDelete(trip.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete trip"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
