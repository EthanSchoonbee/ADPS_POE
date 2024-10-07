import connectToDatabase from "../db/conn.mjs";
import mongoose from "mongoose";

// middleware to allow all routes in a routing file to connect the db instance (singleton)
const connectDbMiddleware = async (req, res, next) => {
    //log the entry into the middleware
    console.log("Entering connectDbMiddleware");
    try {
        //checking if the connection is already established. If not, it will attempt to connect
        if (mongoose.connection.readyState !== 1) {
            //attempts to connect to the database
            console.log("Attempting to connect to database");
            //connects to the database
            const dbInstance = await connectToDatabase();

            if (dbInstance) {
                //if the connection is successful, log it
                console.log("Database connection successful");
                req.db = dbInstance; // Attach the database instance to the request object
            } else {
                console.error("Database connection error: Connection string cannot be Null");
                res.status(500).json({ error: "Failed to connect to the database" });
            }
        } else {
            req.db = mongoose.connection; // Attach the existing connection to the request object
        }

        next(); //proceeds to the next middleware/route handler
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Failed to connect to the database" });
    }
};

export default connectDbMiddleware;
