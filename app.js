const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();

// 🛠️ Apply Security Settings
if (config.security.allowCors) app.use(cors()); // Enable CORS if allowed
app.use(express.json({ limit: config.security.maxBodySize })); // Limit request body size

// 📜 Logging Function
const logRequest = async (ip, method, url) => {
    if (!config.logging.enabled) return; // Skip logging if disabled

    const logData = {
        ip,
        method,
        url,
        timestamp: new Date().toISOString(),
    };

    // 🖥️ Console Logging (if enabled)
    if (config.logging.logToConsole) console.log("Request Log:", logData);

    // 🌐 Discord Webhook Logging (if enabled)
    if (config.logging.webhookUrl) {
        try {
            await axios.post(config.logging.webhookUrl, {
                embeds: [
                    {
                        title: config.logging.discordEmbed.title,
                        description: `**IP:** ${logData.ip}\n**Method:** ${logData.method}\n**URL:** ${logData.url}\n**Timestamp:** ${logData.timestamp}`,
                        color: config.logging.discordEmbed.color,
                    },
                ],
            });
        } catch (err) {
            console.error("❌ Failed to send log to Discord:", err.message);
        }
    }
};

// 🔄 Proxy Route
app.post('/proxy', async (req, res) => {
    try {
        const { method, url, headers, body } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        logRequest(clientIp, method, url); // Log the request

        // Forward the request using Axios
        const response = await axios({ method, url, headers, data: body || undefined });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
});

// 🚀 Start the Server
app.listen(config.server.port, () => console.log(`✅ Proxy server running on port ${config.server.port}`));
