const https = require('https');
const fs = require('fs');
import bodyParser from 'body-parser';
import dbInstance from "./conn.js"; // import the singleton
const express = require('express');
import cors from 'cors';

// create and instance if the express application
const app = express();

// get backend port
const PORT =  process.env.PORT || 3001;

// load in SSL certificate and private key for HTTPS
const options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.cert'),
};

// setup cors options
const corsOptions = {
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE',],
  allowedHeaders: ['Content-Type', 'Authorization',]
};

// middleware:
app.use(cors(corsOptions)); // setup cors header (security)
app.use(bodyParser.json()); // allow JSON request bodies

// Connect to the database
dbInstance.connect();

// routes
// app.use("/api/users", userRoutes); // mount user routes
// app.use("/api/transactions", transactionRoutes); // mount transaction routes


// create HTTPS server and listen on port
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});