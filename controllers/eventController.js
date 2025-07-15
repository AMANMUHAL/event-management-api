// controllers/eventController.js
import { pool } from '../models/db.js';
import dayjs from 'dayjs';

// a. Create Event
export const createEvent = async (req, res) => {
    const { title, datetime, location, capacity } = req.body;

    if (!title || !datetime || !location || !capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (capacity <= 0 || capacity > 1000) {
        return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO events (title, datetime, location, capacity)
       VALUES ($1, $2, $3, $4) RETURNING id`,
            [title, datetime, location, capacity]
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// b. Get Event Details (with registered users)
export const getEventDetails = async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
        if (event.rowCount === 0) return res.status(404).json({ error: 'Event not found' });

        const registrations = await pool.query(
            `SELECT users.id, users.name, users.email
       FROM registrations
       JOIN users ON users.id = registrations.user_id
       WHERE registrations.event_id = $1`,
            [eventId]
        );

        res.status(200).json({ ...event.rows[0], registeredUsers: registrations.rows });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// c. Register a user for event
export const registerUserForEvent = async (req, res) => {
    const eventId = req.params.id;
    const { userId } = req.body;

    try {
        const eventRes = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
        if (eventRes.rowCount === 0) return res.status(404).json({ error: 'Event not found' });

        const event = eventRes.rows[0];

        if (dayjs().isAfter(dayjs(event.datetime))) {
            return res.status(400).json({ error: 'Cannot register for past events' });
        }

        const regCheck = await pool.query(
            `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        if (regCheck.rowCount > 0) {
            return res.status(409).json({ error: 'User already registered' });
        }

        const count = await pool.query(
            `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
            [eventId]
        );

        if (parseInt(count.rows[0].count) >= event.capacity) {
            return res.status(400).json({ error: 'Event is full' });
        }

        await pool.query(
            `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`,
            [userId, eventId]
        );

        res.status(200).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// d. Cancel registration
export const cancelRegistration = async (req, res) => {
    const eventId = req.params.id;
    const { userId } = req.body;

    try {
        const regCheck = await pool.query(
            `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        if (regCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not registered for this event' });
        }

        await pool.query(
            `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        res.status(200).json({ message: 'Registration cancelled' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// e. List upcoming events (sorted by date, then location)
export const listUpcomingEvents = async (req, res) => {
    try {
        const now = new Date().toISOString();

        const events = await pool.query(
            `SELECT * FROM events WHERE datetime > $1
       ORDER BY datetime ASC, location ASC`,
            [now]
        );

        res.status(200).json(events.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// f. Event stats
export const getEventStats = async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
        if (event.rowCount === 0) return res.status(404).json({ error: 'Event not found' });

        const count = await pool.query(
            `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
            [eventId]
        );

        const total = parseInt(count.rows[0].count);
        const capacity = event.rows[0].capacity;
        const remaining = capacity - total;
        const percentUsed = ((total / capacity) * 100).toFixed(2);

        res.status(200).json({
            totalRegistrations: total,
            remainingCapacity: remaining,
            percentUsed: `${percentUsed}%`,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
