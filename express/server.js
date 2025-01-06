const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const TEAM_ID = '6DNPZ54Z8L';
const BUNDLE_ID = 'com.paxx.expopasskeypoc';

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
  console.log('Serving apple-app-site-association');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  const response = {
    "applinks": {},
    "webcredentials": {
      "apps": [`${TEAM_ID}.${BUNDLE_ID}`]
    },
    "appclips": {}
  };
  
  console.log('Sending response:', response);
  res.send(response);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});