const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Helper to generate random username/password for residents
const generateCredentials = (name) => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return {
        username: `${name.toLowerCase()}_${randomStr}`,
        password: Math.random().toString(36).slice(-8)
    };
};

router.post('/register/resident', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, address, municipality } = req.body;
        
        // Generate credentials
        const creds = generateCredentials(firstName);
        const hashedPwd = await bcrypt.hash(creds.password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (role, status, first_name, last_name, phone, email, address, municipality, username, password_hash) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['resident', 'approved', firstName, lastName, phone, email, address, municipality, creds.username, hashedPwd]
        );

        // TODO: Use 'nodemailer' here to send an email to the user with creds.username and creds.password
        console.log(`Email mock: Your username is ${creds.username} and password is ${creds.password}`);

        res.status(201).json({ message: 'Resident registered successfully. Credentials sent to email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/register/organization', async (req, res) => {
    try {
        const { orgType, name, phone, email, username, password } = req.body;
        // Organizations choose their own password, but it still must be hashed!
        const hashedPwd = await bcrypt.hash(password, 10);

        // Status is 'pending' - requires admin approval
        const [result] = await pool.query(
            `INSERT INTO users (role, status, first_name, phone, email, username, password_hash) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [orgType, 'pending', name, phone, email, username, hashedPwd]
        );

        res.status(201).json({ message: 'Organization registered. Pending Admin approval.' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;