const https = require('https');

// IMPORTANT: Replace this with your actual Render backend URL
const BACKEND_URL = 'https://expensetracker-xldf.onrender.com/api/v1/health'; 

console.log(`Starting ping service for: ${BACKEND_URL}`);

const ping = () => {
    https.get(BACKEND_URL, (res) => {
        console.log(`[${new Date().toISOString()}] Ping sent. Status Code: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Ping failed: ${err.message}`);
    });
};

// Ping immediately on start
ping();

// Continue pinging every 5 minutes (300,000 ms)
setInterval(ping, 300000);
