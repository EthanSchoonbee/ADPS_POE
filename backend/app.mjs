import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.mjs'
import chalk from 'chalk';

// create and instance if the express application
const app = express();

// setup cors options
const corsOptions = {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE',],
    allowedHeaders: ['Content-Type', 'Authorization',]
  };

// MIDDLEWARE SETUP:
// 1. Cors : cors header (security)
app.use(cors(corsOptions));
// 2. Body Parser : allow JSON request bodies
app.use(bodyParser.json());

// ROUTE HANDLERS:
// 3. User Routes: mount user routes (endpoints)
app.use("/api/users", userRoutes);
// 4. Transaction Routes: mount transaction routes (endpoints)
//app.use("/api/transactions", transactionRoutes);

// ERROR HANDLING MIDDLEWARE:
// 5. Error Handling: catch and handle errors
const errorHandler = (err, req, res, next) => {
    console.error("\n" + chalk.red(err.stack));
    res.status(500).send({ error: err.message });
};

// use error handler middleware after ALL routes
app.use(errorHandler);

// export app instance
export default app;