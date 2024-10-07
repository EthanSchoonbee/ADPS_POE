import mongoose from "mongoose";
import dotenv from "dotenv";

// load environment variables from the .env file
dotenv.config();

// database name
const databaseName = process.env.MONGO_DATABASE_NAME || "payment_portal";

// connect to mongodb database
async function connectToDatabase() {

    // get the connection string from environment variables (REMOVE FOR PRODUCTION)
    const connectionString = process.env.MONGO_CONNECTION_STRING || "";

    // log connectionString
    console.log("MongoDB Connection String:", connectionString);

    // return existing connection if it's already connected
    if (mongoose.connection.readyState) {
        return mongoose.connection;
    }

    // validate connect string and gracefully handle errors
    if (!connectionString) {
        console.error("Error: MongoDB connection string is missing");
        return null; // return null if connection string is missing
    }

    try {
        //using a direct mongoose connection to the database.
        await mongoose.connect(connectionString, {
            dbName: databaseName,
        });

        if (mongoose.connection.readyState === 1) {
            //log successful message saying connection to mongodb was successful
            console.log("Successfully connected to MongoDB");
            return mongoose.connection; // Connection is successful
        } else {
            console.error("Connection was not successful");
            return null; // Return null if connection is not established
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        return null;
    }
}

// handle graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});

// export function to connect to database
export default connectToDatabase;
