const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

export const getStoredToken = () => localStorage.getItem('trip_token');
export const setStoredToken = (token) => localStorage.setItem('trip_token', token);
export const removeStoredToken = () => localStorage.removeItem('trip_token');

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth (GK-2, GK-3)
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getCurrentUser: () => request('/auth/me'),
  getDemoAccounts: () => request('/auth/demo-accounts'),

  // Traveler Trips (GK-8, GK-13)
  getMyTrips: (status) => request(`/trips${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  getTripById: (id) => request(`/trips/${id}`),
  createTrip: (tripData) => request('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData)
  }),
  updateTrip: (id, tripData) => request(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tripData)
  }),
  deleteTrip: (id) => request(`/trips/${id}`, {
    method: 'DELETE'
  }),
  submitTrip: (id) => request(`/trips/${id}/submit`, {
    method: 'POST'
  }),

  // Places (GK-9, GK-14)
  addPlace: (tripId, placeData) => request(`/trips/${tripId}/places`, {
    method: 'POST',
    body: JSON.stringify(placeData)
  }),
  updatePlace: (tripId, placeId, placeData) => request(`/trips/${tripId}/places/${placeId}`, {
    method: 'PUT',
    body: JSON.stringify(placeData)
  }),
  deletePlace: (tripId, placeId) => request(`/trips/${tripId}/places/${placeId}`, {
    method: 'DELETE'
  }),

  // Photos & Descriptions (GK-10, GK-14)
  addPhoto: (tripId, photoData) => request(`/trips/${tripId}/photos`, {
    method: 'POST',
    body: JSON.stringify(photoData)
  }),
  deletePhoto: (tripId, photoId) => request(`/trips/${tripId}/photos/${photoId}`, {
    method: 'DELETE'
  }),

  // Government Travel Data Management (GK-16, GK-17, GK-19, GK-20, GK-21)
  getGovtTrips: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/govt/trips${query ? `?${query}` : ''}`);
  },
  getGovtTripById: (id) => request(`/govt/trips/${id}`),
  getGovtDestinations: () => request('/govt/destinations'),
  getGovtActivityByDate: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/govt/activity-by-date${query ? `?${query}` : ''}`);
  },
  getGovtPhotosGallery: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/govt/photos-gallery${query ? `?${query}` : ''}`);
  },
  getGovtStats: () => request('/govt/stats')
};
