// controllers/userController.js
import { pool } from '../models/db.js';

// Create a new user
export const createUser = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email)
        return res.status(400).json({ error: 'Name and email are required' });

    try {
        const result = await pool.query(
            `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
            [name, email]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all users (for admin/testing)
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
