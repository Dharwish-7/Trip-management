import React, { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, Camera, AlignLeft } from 'lucide-react';

const PRESET_PHOTOS = [
  { label: 'Scenic View', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Historic Monument', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
  { label: 'City Street', url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sunset Vista', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
];

export const PhotoModal = ({ isOpen, onClose, onAddPhoto, places = [], tripDestination }) => {
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0].url);
  const [caption, setCaption] = useState('');
  const [placeName, setPlaceName] = useState(places[0]?.name || tripDestination || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoUrl) {
      setError('Please provide a photo URL or choose a preset.');
      return;
    }

    try {
      setSubmitting(true);
      await onAddPhoto({
        url: photoUrl,
        caption: caption.trim() || 'Travel snapshot',
        placeName: placeName || tripDestination || 'General'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to attach photo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Photo & Description (GK-10)</h2>
              <p className="text-xs text-slate-500">Enrich your travel documentation with images</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Image Preview */}
          <div className="relative h-44 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={photoUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-white text-xs font-medium">
              Image Preview
            </div>
          </div>

          {/* Preset Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Choose Quick Sample Photo
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_PHOTOS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhotoUrl(preset.url)}
                  className={`h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                    photoUrl === preset.url
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Or custom URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Or Custom Photo URL
            </label>
            <div className="relative">
              <LinkIcon className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="url"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Place Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Associated Place / Landmark
            </label>
            {places && places.length > 0 ? (
              <select
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={tripDestination}>General ({tripDestination})</option>
                {places.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.visitDate})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. Northern Lookout Point"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Photo Description & Caption *
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Magnificent sunset reflection over the calm valley"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Attaching...' : 'Attach Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
