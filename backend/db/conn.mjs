import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from 'chalk';


// load environment variables from the .env file
dotenv.config();

// get the connection string from environment variables
const connnectionString = process.env.MONGO_CONNECTION_STRING || "";

// log connectionString
console.log(chalk.gray(chalk.yellow("MongoDB Connection String:"), connnectionString));

// setup clioent for connecting to mongodb
const client =  new MongoClient(connnectionString);

// variable for holding database instance
let dbInstance = null;

async function connectToDatabase() {

    // check if the instance exists
    if (!dbInstance) {
        try {
            // connect the client to the mongodb server (ATLAS)
            await client.connect()
            console.log(chalk.green("Successfully connected to MongoDB."));

            // select the working database
            dbInstance = client.db(process.env.MONGO_DATABASE || "payment_portal")
    
        } catch (error) { // errors connecting to mongodb
            console.logchalk.gray((chalk.red("Failed to connect to MongoDB:"), error));
        }
    }

    return dbInstance; // return the database instance
}

// export function to connect to database
export default connectToDatabase;