const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment'); // Import moment.js for formatting timestamps
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Load environment variables

const app = express();
app.set('trust proxy', 1); // Trust proxy to get real IPs
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // only 20 requests per minute
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, // Returns rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit headers
});

app.use('/proxy', limiter); // ✅ Apply rate limiting to proxy endpoint

const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
};

const logRequest = async (req) => {
    const clientIp = getClientIp(req);
    const timestamp = moment().utc().format('M/D/YY, h:mm A') + ' (UTC time)';
    const logEntry = `${timestamp} - IP: ${clientIp} - Method: ${req.body.method} - URL: ${req.body.url}`;
    
    // Save to local log file
    fs.appendFile(path.join(__dirname, 'requests.log'), logEntry + '\n', (err) => {
        if (err) console.error('Error writing to log file:', err);
    });

    // Send to Discord webhook if URL is set
    if (DISCORD_WEBHOOK_URL) {
        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: `\`\`\`\n${logEntry}\n\`\`\``
            });
        } catch (error) {
            console.error('Error sending log to Discord:', error.message);
        }
    }
};

app.post('/proxy', async (req, res) => {
    await logRequest(req); // Log request details

    try {
        const { method, url, headers, params, body, contentType, authHeader } = req.body;

        if (!url || !method) {
            return res.status(400).json({ error: "URL and method are required" });
        }

        let finalHeaders = headers || {};

        // Add Authorization header if provided
        if (authHeader) {
            finalHeaders["Authorization"] = authHeader;
        }

        // Set Content-Type if provided
        if (contentType) {
            finalHeaders["Content-Type"] = contentType;
        }

        // Construct the request options
        const options = {
            method,
            url,
            headers: finalHeaders,
            params: params || {},
            data: body || undefined,
        };

        // Make the external API request
        const response = await axios(options);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("API request error:", error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
