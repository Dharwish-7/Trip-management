import { db } from '../db/database.js';

// GK-16 & GK-17: View Submitted Trip Details with Search & Filter
export const getSubmittedTrips = (req, res) => {
  const { search, destination, startDate, endDate, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;
  const trips = db.getCollection('trips');

  // Filter only submitted trips for government oversight
  let submitted = trips.filter(t => t.status === 'Submitted');

  // Search by traveler name, email, title, or destination
  if (search) {
    const term = search.toLowerCase();
    submitted = submitted.filter(t => 
      (t.travelerName && t.travelerName.toLowerCase().includes(term)) ||
      (t.travelerEmail && t.travelerEmail.toLowerCase().includes(term)) ||
      (t.destination && t.destination.toLowerCase().includes(term)) ||
      (t.title && t.title.toLowerCase().includes(term))
    );
  }

  // Filter by specific destination
  if (destination) {
    submitted = submitted.filter(t => 
      t.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  // Filter by travel date overlap
  if (startDate) {
    submitted = submitted.filter(t => t.endDate >= startDate);
  }
  if (endDate) {
    submitted = submitted.filter(t => t.startDate <= endDate);
  }

  // Sorting
  submitted.sort((a, b) => {
    let valA = a[sortBy] || a.createdAt;
    let valB = b[sortBy] || b.createdAt;
    if (sortOrder === 'asc') {
      return valA > valB ? 1 : -1;
    }
    return valA < valB ? 1 : -1;
  });

  return res.json({
    total: submitted.length,
    trips: submitted
  });
};

// GK-16: View Single Submitted Trip Details
export const getSubmittedTripById = (req, res) => {
  const { id } = req.params;
  const trips = db.getCollection('trips');
  const trip = trips.find(t => t.id === id && t.status === 'Submitted');

  if (!trip) {
    return res.status(404).json({ error: 'Submitted trip not found' });
  }

  return res.json(trip);
};

// GK-19: View Destination Analytics
export const getDestinationAnalytics = (req, res) => {
  const trips = db.getCollection('trips').filter(t => t.status === 'Submitted');
  
  // Aggregate data by destination
  const destMap = {};

  trips.forEach(trip => {
    const dest = trip.destination;
    if (!destMap[dest]) {
      destMap[dest] = {
        destination: dest,
        totalTrips: 0,
        travelers: new Set(),
        placesCount: 0,
        photosCount: 0,
        sampleImage: trip.coverImage,
        trips: []
      };
    }

    destMap[dest].totalTrips += 1;
    destMap[dest].travelers.add(trip.userId);
    destMap[dest].placesCount += (trip.places ? trip.places.length : 0);
    destMap[dest].photosCount += (trip.photos ? trip.photos.length : 0);
    destMap[dest].trips.push({
      id: trip.id,
      title: trip.title,
      travelerName: trip.travelerName,
      startDate: trip.startDate,
      endDate: trip.endDate
    });
  });

  const destinations = Object.values(destMap).map(d => ({
    ...d,
    uniqueTravelers: d.travelers.size,
    travelers: undefined // exclude Set
  }));

  // Sort by highest popularity
  destinations.sort((a, b) => b.totalTrips - a.totalTrips);

  return res.json({
    totalDestinations: destinations.length,
    destinations
  });
};

// GK-20: View Travel Activity by Date
export const getTravelActivityByDate = (req, res) => {
  const { targetDate, startDate, endDate } = req.query;
  const trips = db.getCollection('trips').filter(t => t.status === 'Submitted');

  if (targetDate) {
    // Find all travelers active on this specific date
    const activeTrips = trips.filter(t => t.startDate <= targetDate && t.endDate >= targetDate);
    const activePlaces = [];

    activeTrips.forEach(trip => {
      (trip.places || []).forEach(p => {
        if (p.visitDate === targetDate) {
          activePlaces.push({
            tripId: trip.id,
            travelerName: trip.travelerName,
            destination: trip.destination,
            place: p
          });
        }
      });
    });

    return res.json({
      targetDate,
      activeTripsCount: activeTrips.length,
      activeTravelersCount: new Set(activeTrips.map(t => t.userId)).size,
      activeTrips,
      activePlaces
    });
  }

  // Generate calendar activity timeline for a range (default: whole month of October 2026)
  const rangeStart = startDate || '2026-10-01';
  const rangeEnd = endDate || '2026-10-31';

  const dateActivityMap = {};

  // Build daily breakdown
  let curr = new Date(rangeStart);
  const end = new Date(rangeEnd);

  while (curr <= end) {
    const dateStr = curr.toISOString().split('T')[0];
    dateActivityMap[dateStr] = {
      date: dateStr,
      activeTrips: 0,
      activeTravelers: new Set(),
      destinations: new Set()
    };
    curr.setDate(curr.getDate() + 1);
  }

  trips.forEach(trip => {
    Object.keys(dateActivityMap).forEach(dateStr => {
      if (trip.startDate <= dateStr && trip.endDate >= dateStr) {
        dateActivityMap[dateStr].activeTrips += 1;
        dateActivityMap[dateStr].activeTravelers.add(trip.userId);
        dateActivityMap[dateStr].destinations.add(trip.destination);
      }
    });
  });

  const timeline = Object.values(dateActivityMap).map(d => ({
    date: d.date,
    activeTrips: d.activeTrips,
    uniqueTravelers: d.activeTravelers.size,
    destinations: Array.from(d.destinations)
  }));

  return res.json({
    rangeStart,
    rangeEnd,
    timeline
  });
};

// GK-21: View Photos and Descriptions (Auditor Media Gallery)
export const getSubmittedPhotosAndDescriptions = (req, res) => {
  const { destination, search } = req.query;
  const trips = db.getCollection('trips').filter(t => t.status === 'Submitted');

  const gallery = [];

  trips.forEach(trip => {
    (trip.photos || []).forEach(photo => {
      gallery.push({
        id: photo.id,
        url: photo.url,
        caption: photo.caption || trip.description,
        placeName: photo.placeName,
        uploadedAt: photo.uploadedAt,
        tripId: trip.id,
        tripTitle: trip.title,
        destination: trip.destination,
        travelerName: trip.travelerName,
        travelerEmail: trip.travelerEmail,
        tripDescription: trip.description
      });
    });
  });

  let filtered = gallery;
  if (destination) {
    filtered = filtered.filter(item => item.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(item => 
      (item.caption && item.caption.toLowerCase().includes(term)) ||
      (item.placeName && item.placeName.toLowerCase().includes(term)) ||
      (item.travelerName && item.travelerName.toLowerCase().includes(term)) ||
      (item.destination && item.destination.toLowerCase().includes(term))
    );
  }

  return res.json({
    total: filtered.length,
    photos: filtered
  });
};

// Overall Government Metrics Overview
export const getGovtOverviewStats = (req, res) => {
  const trips = db.getCollection('trips');
  const users = db.getCollection('users');

  const submittedTrips = trips.filter(t => t.status === 'Submitted');
  const draftTrips = trips.filter(t => t.status === 'Draft');
  const travelers = users.filter(u => u.role === 'traveler');

  const uniqueDestinations = new Set(submittedTrips.map(t => t.destination));
  let totalPlaces = 0;
  let totalPhotos = 0;

  submittedTrips.forEach(t => {
    totalPlaces += (t.places ? t.places.length : 0);
    totalPhotos += (t.photos ? t.photos.length : 0);
  });

  return res.json({
    totalSubmittedTrips: submittedTrips.length,
    totalDraftTrips: draftTrips.length,
    totalRegisteredTravelers: travelers.length,
    uniqueDestinationsCount: uniqueDestinations.size,
    totalMonitoredPlaces: totalPlaces,
    totalMonitoredPhotos: totalPhotos
  });
};
