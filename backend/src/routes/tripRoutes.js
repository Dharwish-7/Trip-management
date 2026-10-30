import express from 'express';
import {
  getMyTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  submitTrip,
  addPlace,
  updatePlace,
  deletePlace,
  addPhoto,
  deletePhoto
} from '../controllers/tripController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All trip routes require authentication
router.use(authenticateToken);

// Trip routes
router.get('/', getMyTrips);              // GK-13 Previous/current trips
router.post('/', createTrip);             // GK-8 Create trip
router.get('/:id', getTripById);          // Trip details
router.put('/:id', updateTrip);           // GK-14 Edit trip
router.delete('/:id', deleteTrip);        // GK-14 Delete trip
router.post('/:id/submit', submitTrip);   // GK-12 Submit trip

// Places routes
router.post('/:id/places', addPlace);                     // GK-9 Add places
router.put('/:id/places/:placeId', updatePlace);          // GK-14 Edit place
router.delete('/:id/places/:placeId', deletePlace);       // GK-14 Delete place

// Photos routes
router.post('/:id/photos', addPhoto);                     // GK-10 Add description & photos
router.delete('/:id/photos/:photoId', deletePhoto);       // GK-10 / GK-14 Delete photo

export default router;
