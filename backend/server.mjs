import https from 'https';
import fs from 'fs';

import connectToDatabase from './db/conn.mjs'; // import the singleton

import chalk from 'chalk';
import app from './app.mjs';

// get backend port
const PORT =  process.env.PORT || 3001;

// load in SSL certificate and private key for HTTPS
const options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.cert'),
};

// create HTTPS server and listen on port
const server = https.createServer(options, app);

// Connect to the database
const startServer = async () => {
  try {
    // get database connection
    const dbInstance = await connectToDatabase();

    //check if connection is successful or not
    if (dbInstance) {
      console.log(chalk.green("Database connected successfully"));

      server.listen(PORT, () => {
        console.log(chalk.blue(chalk.yellow(`Server is running on `), `https://localhost:${PORT}`));
      });
  }
  } catch (error) {
    console.error(chalk.white(chalk.red("Error connecting to the database:"), error));
  }
}

// start the sever
startServer();