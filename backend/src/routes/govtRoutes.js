import express from 'express';
import {
  getSubmittedTrips,
  getSubmittedTripById,
  getDestinationAnalytics,
  getTravelActivityByDate,
  getSubmittedPhotosAndDescriptions,
  getGovtOverviewStats
} from '../controllers/govtController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Government routes require authentication and the 'official' role
router.use(authenticateToken);
router.use(requireRole('official'));

router.get('/trips', getSubmittedTrips);                     // GK-16, GK-17
router.get('/trips/:id', getSubmittedTripById);              // GK-16
router.get('/destinations', getDestinationAnalytics);        // GK-19
router.get('/activity-by-date', getTravelActivityByDate);    // GK-20
router.get('/photos-gallery', getSubmittedPhotosAndDescriptions); // GK-21
router.get('/stats', getGovtOverviewStats);                  // Overview summary

export default router;
