import mongoose from 'mongoose';
import connectToDatabase from '../db/conn.mjs'; // Adjust the path if necessary
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer;

beforeAll(async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_DATABASE_NAME = 'payment_portal'; // Set the database name
    await mongoose.disconnect(); // Disconnect any existing connections
});

afterAll(async () => {
    // Cleanup the in-memory MongoDB server
    await mongoServer.stop();
    await mongoose.disconnect(); // Ensure the mongoose connection is closed
});

describe('Database Connection', () => {
    beforeEach(async () => {
        await mongoose.disconnect(); // Ensure previous connections are closed before each test
    });

    it('should connect to the database successfully', async () => {
        process.env.MONGO_CONNECTION_STRING = mongoServer.getUri();
        const connection = await connectToDatabase();
        expect(connection).toBeTruthy();
        expect(connection.readyState).toBe(1); // 1 means connected
    });

    it('should return the existing connection if already connected', async () => {
        process.env.MONGO_CONNECTION_STRING = mongoServer.getUri();
        const firstConnection = await connectToDatabase(); // Initial connection
        const secondConnection = await connectToDatabase(); // Attempt to connect again

        // Ensure it returns the same connection instance
        expect(secondConnection).toBe(firstConnection);
        expect(secondConnection.readyState).toBe(1); // 1 means connected
    });

    it('should handle missing connection string gracefully', async () => {
        // Remove the connection string to test error handling
        process.env.MONGO_CONNECTION_STRING = null;

        const connection = await connectToDatabase();
        expect(connection).toBeNull();

        // Restore the original connection string
        process.env.MONGO_CONNECTION_STRING = mongoServer.getUri();
    });

    it('should handle connection errors gracefully', async () => {
        // Mock an invalid connection string
        process.env.MONGO_CONNECTION_STRING = 'invalid_connection_string';

        const connection = await connectToDatabase();
        expect(connection).toBeNull();
    });
});
