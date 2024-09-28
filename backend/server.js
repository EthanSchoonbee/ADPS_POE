const https = require('https');
const fs = require('fs');
const express = require('express');

const PORT =  3001;

const app = express();

const options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.cert'),
};

app.get('/', (req, res) => {
  res.send('Hello, HTTPS!');
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});