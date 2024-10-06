import connectToDatabase from "../db/conn.mjs";
import mongoose from "mongoose";
import chalk from "chalk";

// middleware to allow all routes in a routing file to connect the db instance (singleton)
const connectDbMiddleware = async (req, res, next) => {
    //log the entry into the middleware
    console.log(chalk.blue("Entering connectDbMiddleware"));
    try {
        //checking if the connection is already established. If not, it will attempt to connect
        if (mongoose.connection.readyState !== 1) {
            //attempts to connect to the database
            console.log(chalk.yellow("Attempting to connect to database"));
            //connects to the database
            const dbInstance = await connectToDatabase();
            //if the connection is successful, log it
            console.log(chalk.green("Database connection successful"));
            req.db = dbInstance; // Attach the database instance to the request object
        } else {
            req.db = mongoose.connection; // Attach the existing connection to the request object
        }

        next(); //proceeds to the next middleware/route handler
    } catch (error) {
        console.error(chalk.red("Database connection error:", error));
        res.status(500).json({ error: "Failed to connect to the database" });
    }
};

export default connectDbMiddleware;
