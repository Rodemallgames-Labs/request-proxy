# This is still under development


## Proxy Server

A simple and configurable proxy server built with Node.js, Express, and Axios. This server allows users to forward HTTP requests and log them to a Discord webhook for monitoring and debugging purposes.

## Features

- CORS support for frontend applications
- Configurable logging to Discord
- Request forwarding with customizable settings
- Easily adjustable configuration via environment variables

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/proxy-server.git
   cd proxy-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory for your environment variables. You can use the following template:
   ```plaintext
   PORT=3000
   LOGGING_ENABLED=true
   LOG_TO_CONSOLE=false
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
   LOG_TITLE=My Proxy Logs
   LOG_COLOR=3447003
   ALLOW_CORS=true
   MAX_BODY_SIZE=1mb
   ```

## Usage

1. **Start the server:**
   ```bash
   node app.js
   ```

2. **Send a POST request** to the `/proxy` endpoint with the following JSON body:
   ```json
   {
       "method": "GET",
       "url": "https://api.example.com/data",
       "headers": {
           "Authorization": "Bearer YOUR_TOKEN"
       },
       "body": null
   }
   ```

3. **Check your Discord webhook** to see the logged requests.

## Configuration

You can configure the server using either the `.env` file or by directly modifying the `config.js` file. The following options are available:

- **Server Settings**
  - `PORT`: The port on which the server runs (default: `3000`).

- **Logging Settings**
  - `LOGGING_ENABLED`: Enable or disable logging (`true`/`false`).
  - `LOG_TO_CONSOLE`: Log requests to the console (`true`/`false`).
  - `DISCORD_WEBHOOK_URL`: The URL of the Discord webhook for logging.
  - `LOG_TITLE`: The title of the embed sent to Discord (default: `Proxy Request Log`).
  - `LOG_COLOR`: The color of the embed in Discord (default: `16776960`).

- **Security & Request Limits**
  - `ALLOW_CORS`: Enable or disable CORS support (`true`/`false`).
  - `MAX_BODY_SIZE`: Set the maximum request body size (e.g., `1mb`, `5mb`).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

