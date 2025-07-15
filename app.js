// app.js
import express from 'express';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

export default app;
