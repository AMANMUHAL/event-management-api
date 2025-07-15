// routes/eventRoutes.js
import express from 'express';
import {
    createEvent,
    getEventDetails,
    registerUserForEvent,
    cancelRegistration,
    listUpcomingEvents,
    getEventStats,
} from '../controllers/eventController.js';

const router = express.Router();

// a. Create Event
router.post('/', createEvent);

// b. Get Event Details
router.get('/:id', getEventDetails);

// c. Register for Event
router.post('/:id/register', registerUserForEvent);

// d. Cancel Registration
router.delete('/:id/register', cancelRegistration);

// e. List Upcoming Events
router.get('/upcoming/list', listUpcomingEvents);

// f. Event Stats
router.get('/:id/stats', getEventStats);

export default router;
