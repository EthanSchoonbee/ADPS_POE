import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.mjs'
import paymentRoutes from './routes/payment.mjs'
import chalk from 'chalk';

// create an instance of the express application
const app = express();

// setup cors options
const corsOptions = {
    origin: 'https://localhost:5001',
    methods: ['GET', 'POST', 'PUT', 'DELETE',],
    allowedHeaders: ['Content-Type', 'Authorization',]
  };

// MIDDLEWARE SETUP:
// 1. Cors : cors header (security)
app.use(cors(corsOptions));
// 2. Body Parser : allow JSON request bodies
app.use(bodyParser.json());

// ROUTE HANDLERS:
// 3. Auth Routes: mount auth routes (endpoints)
app.use("/api/auth", authRoutes);
// 4. Transaction Routes: mount transaction routes (endpoints)
app.use("/api/payment", paymentRoutes);
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