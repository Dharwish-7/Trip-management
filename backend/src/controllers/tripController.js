import { db } from '../db/database.js';

// GK-13: Get all trips for the authenticated traveler (with status filter: Draft, Submitted, All)
export const getMyTrips = (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;
  const trips = db.getCollection('trips');

  let userTrips = trips.filter(t => t.userId === userId);

  if (status) {
    userTrips = userTrips.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  // Sort by created date descending
  userTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json(userTrips);
};

// Get single trip details
export const getTripById = (req, res) => {
  const { id } = req.params;
  const trips = db.getCollection('trips');
  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  // Ensure user owns trip or is a government official
  if (trip.userId !== req.user.id && req.user.role !== 'official') {
    return res.status(403).json({ error: 'Unauthorized to view this trip' });
  }

  return res.json(trip);
};

// GK-8: Create New Trip
export const createTrip = (req, res) => {
  try {
    const { title, destination, startDate, endDate, purpose, budget, description, coverImage } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, destination, start date, and end date are required' });
    }

    const trips = db.getCollection('trips');
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: req.user.id,
      travelerName: req.user.name,
      travelerEmail: req.user.email,
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      purpose: purpose || 'Leisure & Travel',
      budget: Number(budget) || 0,
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      status: 'Draft', // Initial status
      places: [],
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    trips.unshift(newTrip);
    db.setCollection('trips', trips);

    return res.status(201).json({
      message: 'Trip created successfully',
      trip: newTrip
    });
  } catch (err) {
    console.error('Error creating trip:', err);
    return res.status(500).json({ error: 'Failed to create trip' });
  }
};

// GK-14: Edit Trip Details
export const updateTrip = (req, res) => {
  const { id } = req.params;
  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Cannot modify a trip that does not belong to you' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Submitted trips cannot be edited. Please contact government authorities for amendments.' });
  }

  const { title, destination, startDate, endDate, purpose, budget, description, coverImage } = req.body;

  const updatedTrip = {
    ...trip,
    title: title ? title.trim() : trip.title,
    destination: destination ? destination.trim() : trip.destination,
    startDate: startDate || trip.startDate,
    endDate: endDate || trip.endDate,
    purpose: purpose !== undefined ? purpose : trip.purpose,
    budget: budget !== undefined ? Number(budget) : trip.budget,
    description: description !== undefined ? description : trip.description,
    coverImage: coverImage || trip.coverImage,
    updatedAt: new Date().toISOString()
  };

  trips[tripIndex] = updatedTrip;
  db.setCollection('trips', trips);

  return res.json({
    message: 'Trip updated successfully',
    trip: updatedTrip
  });
};

// GK-14: Delete Trip
export const deleteTrip = (req, res) => {
  const { id } = req.params;
  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Cannot delete a trip that does not belong to you' });
  }

  trips.splice(tripIndex, 1);
  db.setCollection('trips', trips);

  return res.json({ message: 'Trip deleted successfully', tripId: id });
};

// GK-12: Submit Trip
export const submitTrip = (req, res) => {
  const { id } = req.params;
  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Cannot submit a trip that is not yours' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Trip has already been submitted to government authorities' });
  }

  if (!trip.places || trip.places.length === 0) {
    return res.status(400).json({ error: 'Please add at least one visited place/itinerary item before submitting your trip.' });
  }

  trip.status = 'Submitted';
  trip.submittedAt = new Date().toISOString();
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.json({
    message: 'Trip officially submitted for government audit & record keeping!',
    trip
  });
};

// GK-9: Add Place to Trip
export const addPlace = (req, res) => {
  const { id } = req.params;
  const { name, location, visitDate, notes, rating } = req.body;

  if (!name || !visitDate) {
    return res.status(400).json({ error: 'Place name and visit date are required' });
  }

  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to modify this trip' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Cannot add places to a submitted trip' });
  }

  const newPlace = {
    id: `plc-${Date.now()}`,
    name: name.trim(),
    location: (location || trip.destination).trim(),
    visitDate,
    notes: notes || '',
    rating: Number(rating) || 5
  };

  trip.places.push(newPlace);
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.status(201).json({
    message: 'Place added to trip successfully',
    place: newPlace,
    trip
  });
};

// GK-14: Edit Place in Trip
export const updatePlace = (req, res) => {
  const { id, placeId } = req.params;
  const { name, location, visitDate, notes, rating } = req.body;

  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Cannot modify a submitted trip' });
  }

  const placeIndex = trip.places.findIndex(p => p.id === placeId);
  if (placeIndex === -1) {
    return res.status(404).json({ error: 'Place not found in this trip' });
  }

  const updatedPlace = {
    ...trip.places[placeIndex],
    name: name ? name.trim() : trip.places[placeIndex].name,
    location: location ? location.trim() : trip.places[placeIndex].location,
    visitDate: visitDate || trip.places[placeIndex].visitDate,
    notes: notes !== undefined ? notes : trip.places[placeIndex].notes,
    rating: rating !== undefined ? Number(rating) : trip.places[placeIndex].rating
  };

  trip.places[placeIndex] = updatedPlace;
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.json({ message: 'Place updated', place: updatedPlace, trip });
};

// GK-14: Delete Place from Trip
export const deletePlace = (req, res) => {
  const { id, placeId } = req.params;
  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Cannot delete places from a submitted trip' });
  }

  trip.places = trip.places.filter(p => p.id !== placeId);
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.json({ message: 'Place removed from trip', trip });
};

// GK-10: Add Description and Photos to Trip
export const addPhoto = (req, res) => {
  const { id } = req.params;
  const { url, caption, placeName } = req.body;

  let imageUrl = url;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'Photo URL or uploaded image file is required' });
  }

  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to add photos to this trip' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Cannot add photos to a submitted trip' });
  }

  const newPhoto = {
    id: `pht-${Date.now()}`,
    url: imageUrl,
    caption: caption || '',
    placeName: placeName || trip.destination,
    uploadedAt: new Date().toISOString()
  };

  trip.photos.push(newPhoto);
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.status(201).json({
    message: 'Photo added to trip successfully',
    photo: newPhoto,
    trip
  });
};

// GK-10 / GK-14: Delete Photo from Trip
export const deletePhoto = (req, res) => {
  const { id, photoId } = req.params;
  const trips = db.getCollection('trips');
  const tripIndex = trips.findIndex(t => t.id === id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = trips[tripIndex];
  if (trip.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (trip.status === 'Submitted') {
    return res.status(400).json({ error: 'Cannot delete photos from a submitted trip' });
  }

  trip.photos = trip.photos.filter(p => p.id !== photoId);
  trip.updatedAt = new Date().toISOString();

  trips[tripIndex] = trip;
  db.setCollection('trips', trips);

  return res.json({ message: 'Photo deleted', trip });
};
