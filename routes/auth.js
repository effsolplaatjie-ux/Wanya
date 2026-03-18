const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 

// LOGIN ENDPOINT: https://wanya.onrender.com/api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Search for user in MySQL
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Username not found." });
        }

        const user = users[0];

        // Compare entered password (Wanya1) with the Bcrypt hash in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        // Create Secure Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'supersecretkey', 
            { expiresIn: '24h' }
        );

        res.json({
            token,
            role: user.role,
            message: "Login successful"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database connection error." });
    }
});

module.exports = router;