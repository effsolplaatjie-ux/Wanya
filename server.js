require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// CORS Policy Configuration for Netlify
app.use(cors({
    origin: ['https://radiant-buttercream-1947dd.netlify.app', 'http://localhost:5500'], // Update this with your Netlify URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Wanya Tsotsi server running on port ${PORT}`);
});