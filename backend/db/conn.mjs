import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from 'chalk';

// load environment variables from the .env file
dotenv.config();

// get the connection string from environment variables (REMOVE FOR PRODUCTION)
const connnectionString = process.env.MONGO_CONNECTION_STRING || "";

// validate connectio string and gracefully handle errors
if (!connnectionString) {
    console.error(chalk.red("Error: MongoDB conection string is missing"));
    process.exit(1);
}

// log connectionString
console.log(chalk.gray(chalk.yellow("MongoDB Connection String:"), connnectionString));

// variable for holding database instance
let dbInstance = null;

async function connectToDatabase() {
    // setup client for connecting to mongodb only if connection string is valid
    const client =  new MongoClient(connnectionString);

    // check if the instance exists
    if (!dbInstance) {
        try {
            // connect the client to the mongodb server (ATLAS)
            await client.connect()
            console.log(chalk.green("Successfully connected to MongoDB"));

            // select the working database
            dbInstance = client.db(process.env.MONGO_DATABASE || "payment_portal")
    
        } catch (error) { 
            // handle errors connecting to mongodb
            console.error(chalk.gray(chalk.red("Failed to connect to MongoDB:"), error));
            return null; // rethrow error for upstream handling
        }
    }

    return dbInstance; // return the database instance
}

// export function to connect to database
export default connectToDatabase;