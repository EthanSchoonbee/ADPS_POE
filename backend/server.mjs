import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import connectToDatabase from './db/conn.mjs'; // import the singleton
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

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
connectToDatabase().then((dbInstance) => {
  if (dbInstance) {
      console.log(chalk.green("Database connected successfully."));
  } else {
      console.error(chalk.red("Failed to connect to the database."));
  }
}).catch((error) => {
  console.error(chalk.white(chalk.red("Error connecting to the database:"), error));
});

// routes
// app.use("/api/users", userRoutes); // mount user routes
// app.use("/api/transactions", transactionRoutes); // mount transaction routes


// create HTTPS server and listen on port
https.createServer(options, app).listen(PORT, () => {
  console.log(chalk.blue(chalk.yellow(`Server is running on `), `https://localhost:${PORT}`));
});