const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const session = require('express-session');

// Configuration
const CLIENT_ID = process.env.ZENDESK_CLIENT_ID;
const CLIENT_SECRET = process.env.ZENDESK_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = 'https://api.getbase.com/oauth2/authorize';
const TOKEN_URL = 'https://api.getbase.com/oauth2/token';

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Home page
app.get('/', (req, res) => {
    res.send(`
        <h1>Zendesk OAuth Example</h1>
        <a href="/login">Login with Zendesk</a>
    `);
});

// Login route
app.get('/login', (req, res) => {
    const authParams = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI
    });

    const authUrl = `${AUTH_URL}?${authParams.toString()}`;
    res.redirect(authUrl);
});

// Callback route
app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code not received.' });
    }

    try {
        // Create token request data
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);

        // Create Basic Auth token
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        // Make token request
        const response = await axios.post(TOKEN_URL, params, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokens = response.data;

        // Store tokens in session
        req.session.access_token = tokens.access_token;
        req.session.refresh_token = tokens.refresh_token;

        // Create token response
        const tokenResponse = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
            expires_in: tokens.expires_in
        };

        // Log tokens to console
        console.log('\n=== OAuth Tokens ===');
        console.log(JSON.stringify(tokenResponse, null, 2));
        console.log('==================\n');

        // Send JSON response
        res.json(tokenResponse);

    } catch (error) {
        const errorResponse = {
            error: 'Failed to get access token',
            details: error.response?.data || error.message
        };

        console.log('\n=== OAuth Error ===');
        console.log(JSON.stringify(errorResponse, null, 2));
        console.log('=================\n');

        res.status(400).json(errorResponse);
    }
});

// Get stored tokens
app.get('/tokens', (req, res) => {
    if (!req.session.access_token || !req.session.refresh_token) {
        return res.status(404).json({ error: 'No tokens found in session' });
    }

    const tokens = {
        access_token: req.session.access_token,
        refresh_token: req.session.refresh_token
    };

    res.json(tokens);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});