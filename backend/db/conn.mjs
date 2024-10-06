import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

// load environment variables from the .env file
dotenv.config();

// get the connection string from environment variables (REMOVE FOR PRODUCTION)
const connectionString = process.env.MONGO_CONNECTION_STRING || "";
// database name
const databaseName = process.env.MONGO_DATABASE_NAME || "payment_portal";

// validate connect string and gracefully handle errors
if (!connectionString) {
    console.error(chalk.red("Error: MongoDB connection string is missing"));
    process.exit(1);
}

// log connectionString
console.log(
    chalk.gray(chalk.yellow("MongoDB Connection String:"), connectionString)
);

// connect to mongodb database
async function connectToDatabase() {
    try {
        //using a direct mongoose connection to the database.
        await mongoose.connect(connectionString, {
            dbName: databaseName,
        });

        //log successful message saying connection to mongodb was successful
        console.log(chalk.green("Successfully connected to MongoDB"));

        return mongoose.connection; // return database connection
    } catch (error) {
        console.error(chalk.red("Failed to connect to MongoDB:", error));
        return null;
    }
}

// export function to connect to database
export default connectToDatabase;
