import React, { useState } from 'react';
import { api } from '../services/api';
import { PlaceModal } from '../components/PlaceModal';
import { PhotoModal } from '../components/PhotoModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Send,
  Lock,
  Star,
  FileText
} from 'lucide-react';

export const TripDetails = ({ trip, onBack, onTripUpdated }) => {
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editForm, setEditForm] = useState({
    title: trip.title,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget,
    purpose: trip.purpose,
    description: trip.description
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = currentTrip.status === 'Submitted';

  // GK-14: Save Edited Trip Details
  const handleSaveTripDetails = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.updateTrip(currentTrip.id, editForm);
      setCurrentTrip(res.trip);
      setIsEditingTrip(false);
      setStatusMsg({ type: 'success', text: 'Trip details updated successfully (GK-14).' });
      if (onTripUpdated) onTripUpdated(res.trip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update trip' });
    } finally {
      setSubmitting(false);
    }
  };

  // GK-9 & GK-14: Save place (add or update)
  const handleSavePlace = async (placeData) => {
    try {
      if (placeToEdit) {
        const res = await api.updatePlace(currentTrip.id, placeToEdit.id, placeData);
        setCurrentTrip(res.trip);
        setStatusMsg({ type: 'success', text: 'Place updated successfully (GK-14).' });
      } else {
        const res = await api.addPlace(currentTrip.id, placeData);
        setCurrentTrip(res.trip);
        setStatusMsg({ type: 'success', text: 'Place added to trip successfully (GK-9).' });
      }
      setPlaceToEdit(null);
      if (onTripUpdated) onTripUpdated(currentTrip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save place' });
    }
  };

  // GK-14: Delete Place
  const handleDeletePlace = async (placeId) => {
    if (!window.confirm('Delete this visited place from the itinerary? (GK-14)')) return;
    try {
      const res = await api.deletePlace(currentTrip.id, placeId);
      setCurrentTrip(res.trip);
      setStatusMsg({ type: 'success', text: 'Place removed from itinerary (GK-14).' });
      if (onTripUpdated) onTripUpdated(res.trip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete place' });
    }
  };

  // GK-10: Add Photo
  const handleAddPhoto = async (photoData) => {
    try {
      const res = await api.addPhoto(currentTrip.id, photoData);
      setCurrentTrip(res.trip);
      setStatusMsg({ type: 'success', text: 'Photo & description attached to trip! (GK-10)' });
      if (onTripUpdated) onTripUpdated(res.trip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add photo' });
    }
  };

  // GK-10 / GK-14: Delete Photo
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      const res = await api.deletePhoto(currentTrip.id, photoId);
      setCurrentTrip(res.trip);
      setStatusMsg({ type: 'success', text: 'Photo removed.' });
      if (onTripUpdated) onTripUpdated(res.trip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete photo' });
    }
  };

  // GK-12: Submit Trip
  const handleSubmitTrip = async () => {
    if (!currentTrip.places || currentTrip.places.length === 0) {
      setStatusMsg({ type: 'error', text: 'You must add at least one visited place before submitting this trip (GK-12).' });
      return;
    }

    if (!window.confirm('Are you ready to submit this trip for official government verification? Once submitted, the trip cannot be further modified.')) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitTrip(currentTrip.id);
      setCurrentTrip(res.trip);
      setStatusMsg({
        type: 'success',
        text: '🎉 Congratulations! Trip submitted to government authorities for travel record compliance (GK-12).'
      });
      if (onTripUpdated) onTripUpdated(res.trip);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit trip' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isSubmitted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Submitted to Government (GK-12)</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Draft Itinerary (In Progress)</span>
              </>
            )}
          </span>

          {/* GK-12 Submit Button (if draft) */}
          {!isSubmitted && (
            <button
              onClick={handleSubmitTrip}
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Trip (GK-12)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            onClick={() => setStatusMsg({ type: '', text: '' })}
            className="text-xs font-bold underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Card Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img
            src={currentTrip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={currentTrip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Banner Text Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="inline-flex items-center space-x-1 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{currentTrip.destination}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">{currentTrip.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {currentTrip.purpose || 'Travel & Exploration'}
              </p>
            </div>

            {/* Quick Action buttons on Banner */}
            {!isSubmitted && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditingTrip(!isEditingTrip)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>{isEditingTrip ? 'Cancel Edit' : 'Edit Details (GK-14)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Trip Details Inline Form (GK-14) */}
        {isEditingTrip && !isSubmitted && (
          <form onSubmit={handleSaveTripDetails} className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Edit Trip Details (GK-14)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trip Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={editForm.destination}
                  onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget ($)</label>
                <input
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Theme</label>
                <input
                  type="text"
                  value={editForm.purpose}
                  onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description (GK-10)</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditingTrip(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
              >
                Save Changes (GK-14)
              </button>
            </div>
          </form>
        )}

        {/* Stats Sub-bar */}
        <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-sky-600" />
            <div>
              <p className="font-bold text-slate-900">{currentTrip.startDate} → {currentTrip.endDate}</p>
              <p className="text-slate-400">Duration Period</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">${currentTrip.budget?.toLocaleString() || 0}</p>
              <p className="text-slate-400">Total Budget</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="font-bold text-slate-900">{currentTrip.places?.length || 0} Places Visited</p>
              <p className="text-slate-400">GK-9 Itinerary</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-purple-600" />
            <div>
              <p className="font-bold text-slate-900">{currentTrip.photos?.length || 0} Photos Uploaded</p>
              <p className="text-slate-400">GK-10 Gallery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section (GK-10) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
          <FileText className="h-5 w-5 text-sky-600" />
          <h2>Trip Description & Itinerary Narrative (GK-10)</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {currentTrip.description || 'No detailed narrative added yet. Click Edit Details to add notes and background for this trip.'}
        </p>
        {isSubmitted && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>This trip is officially locked and submitted to government record authorities (Submitted on {new Date(currentTrip.submittedAt || currentTrip.updatedAt).toLocaleString()}).</span>
          </div>
        )}
      </div>

      {/* Section 1: Visited Places (GK-9, GK-14) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="h-5 w-5 text-emerald-600" />
              <span>Visited Places & Attractions (GK-9)</span>
            </h2>
            <p className="text-xs text-slate-500">Document individual points of interest visited during this journey</p>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => {
                setPlaceToEdit(null);
                setIsPlaceModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Place (GK-9)</span>
            </button>
          )}
        </div>

        {(!currentTrip.places || currentTrip.places.length === 0) ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Compass className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No places added to this trip yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add at least one landmark, sight, or attraction before submitting your trip for verification.
            </p>
            {!isSubmitted && (
              <button
                onClick={() => {
                  setPlaceToEdit(null);
                  setIsPlaceModalOpen(true);
                }}
                className="mt-3 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Place Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTrip.places.map((place, idx) => (
              <div
                key={place.id || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Stop #{idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{place.name}</h4>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-0.5 text-amber-500">
                      {[...Array(place.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{place.location}</span>
                  </div>

                  <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Visited on: {place.visitDate}</span>
                  </div>

                  {place.notes && (
                    <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{place.notes}"
                    </p>
                  )}
                </div>

                {!isSubmitted && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setPlaceToEdit(place);
                        setIsPlaceModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      title="Edit Place (GK-14)"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Place (GK-14)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Photos & Media (GK-10) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              <span>Trip Photos & Image Logs (GK-10)</span>
            </h2>
            <p className="text-xs text-slate-500">Attach photos, views, and visual documentation</p>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Photo (GK-10)</span>
            </button>
          )}
        </div>

        {(!currentTrip.photos || currentTrip.photos.length === 0) ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No photos attached yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add photos with descriptions (GK-10) to make your travel record vivid and compliant for official review.
            </p>
            {!isSubmitted && (
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="mt-3 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Photo Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentTrip.photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {photo.placeName && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-semibold">
                      {photo.placeName}
                    </span>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {photo.caption}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                    {!isSubmitted && (
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-slate-400 hover:text-red-600 transition"
                        title="Delete Photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <PlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        onSave={handleSavePlace}
        placeToEdit={placeToEdit}
        tripDestination={currentTrip.destination}
      />

      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={handleAddPhoto}
        places={currentTrip.places || []}
        tripDestination={currentTrip.destination}
      />
    </div>
  );
};
