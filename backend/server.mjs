import https from 'https';
import fs from 'fs';
import connectToDatabase from './db/conn.mjs'; // import the singleton
import app from './app.mjs';

// get backend port
const PORT =  process.env.PORT || 5001;

// load in SSL certificate and private key for HTTPS
const sslOptions = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.cert'),
};

// create HTTPS server and listen on port
const server = https.createServer(sslOptions, app);

// Connect to the database and listen on port
const startServer = async () => {
  try {
    // establish database connection (get instance)
    const dbInstance = await connectToDatabase();

    //check if connection is successful or not
    if (dbInstance) {
      console.log("Database connected successfully");

      server.listen(PORT, () => {
        console.log(`Server is running on : https://localhost:${PORT}`);
      });
  }
  } catch (error) {
    console.error("Error connecting to the database : ", error);
  }
}

// start the sever with an IIFE (async/await result handler)
(async () => {
  try {
    await startServer(); // wait for server to start
  } catch(error) {
    console.error("Error starting server : ", error.message);
  }
})();