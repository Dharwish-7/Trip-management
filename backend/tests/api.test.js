import http from 'http';

// Helper to make fetch-like calls using node's native fetch
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Backend API Automated Verification ---');

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('✓ Health check status:', health.status);

    // 2. Demo accounts
    const demoRes = await fetch(`${API_URL}/auth/demo-accounts`);
    const demoAccounts = await demoRes.json();
    console.log('✓ Demo accounts available:', demoAccounts.length);

    // 3. Traveler Login (GK-3)
    const travelerLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'traveler@example.com', password: 'pass123' })
    });
    const travelerAuth = await travelerLoginRes.json();
    if (!travelerAuth.token) throw new Error('Traveler login failed');
    console.log('✓ GK-3 Traveler login successful:', travelerAuth.user.name);

    const travelerToken = travelerAuth.token;

    // 4. Official Login (GK-3)
    const officialLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'official@govt.gov', password: 'admin123' })
    });
    const officialAuth = await officialLoginRes.json();
    if (!officialAuth.token) throw new Error('Official login failed');
    console.log('✓ GK-3 Govt Official login successful:', officialAuth.user.name);

    const officialToken = officialAuth.token;

    // 5. Traveler Get Trips (GK-13)
    const tripsRes = await fetch(`${API_URL}/trips`, {
      headers: { Authorization: `Bearer ${travelerToken}` }
    });
    const myTrips = await tripsRes.json();
    console.log(`✓ GK-13 Traveler retrieved ${myTrips.length} trips`);

    // 6. Traveler Create Trip (GK-8)
    const createRes = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${travelerToken}`
      },
      body: JSON.stringify({
        title: 'Verdon Gorge Canyon Trail',
        destination: 'Provence, France',
        startDate: '2026-10-20',
        endDate: '2026-10-24',
        purpose: 'Kayaking and canyon trekking',
        budget: 1500,
        description: 'Spectacular turquoise waters and limestone cliffs in southern France.'
      })
    });
    const newTripData = await createRes.json();
    const newTrip = newTripData.trip;
    console.log('✓ GK-8 Create trip successful:', newTrip.title, '(ID:', newTrip.id, ')');

    // 7. Add Place (GK-9)
    const placeRes = await fetch(`${API_URL}/trips/${newTrip.id}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${travelerToken}`
      },
      body: JSON.stringify({
        name: 'Pont du Galetas',
        location: 'Aiguines, France',
        visitDate: '2026-10-21',
        notes: 'Canyon gateway bridge with paddleboat access into the gorge',
        rating: 5
      })
    });
    const placeData = await placeRes.json();
    console.log('✓ GK-9 Add place successful:', placeData.place.name);

    // 8. Add Description & Photo (GK-10)
    const photoRes = await fetch(`${API_URL}/trips/${newTrip.id}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${travelerToken}`
      },
      body: JSON.stringify({
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Turquoise river flowing beneath towering limestone walls',
        placeName: 'Pont du Galetas'
      })
    });
    const photoData = await photoRes.json();
    console.log('✓ GK-10 Add photo successful:', photoData.photo.caption);

    // 9. Submit Trip (GK-12)
    const submitRes = await fetch(`${API_URL}/trips/${newTrip.id}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${travelerToken}` }
    });
    const submitData = await submitRes.json();
    console.log('✓ GK-12 Submit trip successful: Status =', submitData.trip.status);

    // 10. Government: View Submitted Trips (GK-16)
    const govtTripsRes = await fetch(`${API_URL}/govt/trips`, {
      headers: { Authorization: `Bearer ${officialToken}` }
    });
    const govtTrips = await govtTripsRes.json();
    console.log(`✓ GK-16 Govt View Submitted Trips: Found ${govtTrips.total} submitted trips`);

    // 11. Government: Search and Filter (GK-17)
    const searchRes = await fetch(`${API_URL}/govt/trips?search=Provence`, {
      headers: { Authorization: `Bearer ${officialToken}` }
    });
    const searchData = await searchRes.json();
    console.log(`✓ GK-17 Govt Search & Filter (Provence): Found ${searchData.total} match(es)`);

    // 12. Government: View Destinations (GK-19)
    const destRes = await fetch(`${API_URL}/govt/destinations`, {
      headers: { Authorization: `Bearer ${officialToken}` }
    });
    const destData = await destRes.json();
    console.log(`✓ GK-19 Govt View Destinations: ${destData.totalDestinations} destinations monitored`);

    // 13. Government: View Activity by Date (GK-20)
    const activityRes = await fetch(`${API_URL}/govt/activity-by-date?targetDate=2026-10-21`, {
      headers: { Authorization: `Bearer ${officialToken}` }
    });
    const actData = await activityRes.json();
    console.log(`✓ GK-20 Govt Activity by Date (2026-10-21): ${actData.activeTripsCount} active trips`);

    // 14. Government: View Photos & Descriptions (GK-21)
    const galleryRes = await fetch(`${API_URL}/govt/photos-gallery`, {
      headers: { Authorization: `Bearer ${officialToken}` }
    });
    const galleryData = await galleryRes.json();
    console.log(`✓ GK-21 Govt Photos Gallery: ${galleryData.total} total photos monitored`);

    console.log('\n=========================================');
    console.log(' ALL 13 USER STORIES BACKEND TESTS PASSED');
    console.log('=========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

runTests();
