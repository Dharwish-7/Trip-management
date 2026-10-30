import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Image as ImageIcon,
  Search,
  MapPin,
  User,
  Calendar,
  X,
  Eye,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const GovtPhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await api.getGovtPhotosGallery({
        search,
        destination: destinationFilter
      });
      setPhotos(res.photos || []);
    } catch (err) {
      console.error('Failed to fetch photo gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [destinationFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPhotos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Visual Evidence Audit • GK-21</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Submitted Photos & Descriptions Gallery
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Inspect photographic evidence and trip descriptions submitted by travelers (GK-21).
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <ImageIcon className="h-6 w-6 text-pink-600" />
          <div>
            <p className="text-xl font-black text-slate-900">{photos.length}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Photos Audited</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-2 w-full">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by caption, landmark, traveler, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-pink-700 transition"
          >
            Search
          </button>
        </form>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter destination..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading photographic audit media...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No photos match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing the search query or destination filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-bold inline-flex items-center space-x-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Inspect Full Record (GK-21)</span>
                  </span>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-semibold">
                  {item.destination}
                </div>
              </div>

              {/* Description / Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-semibold uppercase">
                    <MapPin className="h-3 w-3 text-pink-500" />
                    <span>{item.placeName || item.destination}</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-2">
                    {item.caption}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.travelerName}</span>
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Audit Inspection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            {/* Left: Image */}
            <div className="md:w-3/5 bg-black flex items-center justify-center p-2 relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[60vh] md:max-h-[80vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Right: Audit Metadata */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-pink-700 uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded">
                    Audit Record GK-21
                  </span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedPhoto.caption}</h3>
                  <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-pink-500" />
                    <span>{selectedPhoto.placeName} ({selectedPhoto.destination})</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600">Traveler: <strong>{selectedPhoto.travelerName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600">Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600">Trip: <strong>{selectedPhoto.tripTitle}</strong></span>
                  </div>
                </div>

                {selectedPhoto.tripDescription && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Associated Trip Description
                    </h5>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                      "{selectedPhoto.tripDescription}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
