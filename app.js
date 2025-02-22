const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Allows requests from any frontend
app.use(express.json()); // Parses JSON bodies

app.post('/proxy', async (req, res) => {
    try {
        const { method, url, headers, body } = req.body;

        // Forward the request using Axios
        const response = await axios({
            method,
            url,
            headers,
            data: body || undefined, // Ensure no empty bodies for GET requests
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
