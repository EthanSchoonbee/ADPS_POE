import connectToDatabase from "../db/conn.mjs";

// global variable for the database instance
let db = null;

// middleware to allow all routes in a routing file to connect the db instance (singleton)
const connectDbMiddleware = async (req, res, next) => {
    if (!db) {
        db = await connectToDatabase(); // connect to the database
    }
    if (!db) {
        return res.status(500).send({ error: "Failed to connect to the database" });
    }
    req.db = db; // attach the database instance to the request object
    next(); // proceed to the next middleware/route handler
};

export default connectDbMiddleware;