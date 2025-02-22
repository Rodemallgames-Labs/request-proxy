const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment'); // Import moment.js for formatting timestamps
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

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
    logRequest(req); // Log request details

    try {
        const { method, url, headers, body } = req.body;

        // Forward the request using Axios
        const response = await axios({
            method,
            url,
            headers,
            data: body || undefined,
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
