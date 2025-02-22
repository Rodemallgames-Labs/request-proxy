require('dotenv').config();

const config = {
    // 🔧 General Server Settings
    server: {
        port: process.env.PORT || 3000, // Set server port (default: 3000)
    },

    // 🔍 Logging Settings
    logging: {
        enabled: process.env.LOGGING_ENABLED === "true", // Enable logging (true/false)
        logToConsole: process.env.LOG_TO_CONSOLE === "true", // Show logs in terminal (true/false)

        // 🌐 Webhook Configuration
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || "", // Use environment variable or paste manually

        // Customize how logs appear in Discord
        discordEmbed: {
            title: process.env.LOG_TITLE || "Proxy Request Log",
            color: parseInt(process.env.LOG_COLOR) || 16776960, // Default: Yellow (16776960)
        }
    },

    // 🔒 Security & Request Limits
    security: {
        allowCors: process.env.ALLOW_CORS === "true", // Enable CORS (true/false)
        maxBodySize: process.env.MAX_BODY_SIZE || "1mb", // Set max request body size (e.g., "1mb", "5mb")
    }
};

module.exports = config;
