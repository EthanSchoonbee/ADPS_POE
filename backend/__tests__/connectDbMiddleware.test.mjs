import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../db/conn.mjs"; // Adjust the path as necessary
import connectDbMiddleware from "../middleware/connectDbMiddleware"; // Adjust the path as necessary

jest.mock("../db/conn.mjs");

const app = express();
app.use(connectDbMiddleware); // Use your middleware

// Define a test route to verify middleware functionality
app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test successful" });
});

describe("connectDbMiddleware", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks
    });

    it("should connect to the database when not already connected", async () => {
        // Mocking the readyState to 0 (not connected)
        Object.defineProperty(mongoose.connection, 'readyState', {
            value: 0,
            writable: true, // make it writable to allow changes during the test
        });

        connectToDatabase.mockResolvedValue("mockDbInstance"); // Mock the connection

        const response = await request(app).get("/test");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Test successful");
        expect(connectToDatabase).toHaveBeenCalled(); // Verify connection attempt
    });

    it("should skip connecting if already connected", async () => {
        // Mocking the readyState to 1 (connected)
        Object.defineProperty(mongoose.connection, 'readyState', {
            value: 1,
            writable: true, // make it writable
        });

        const response = await request(app).get("/test");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Test successful");
        expect(connectToDatabase).not.toHaveBeenCalled(); // Should not attempt to connect
    });

    it("should return a 500 error if connection fails", async () => {
        // Mocking the readyState to 0 (not connected)
        Object.defineProperty(mongoose.connection, 'readyState', {
            value: 0,
            writable: true, // make it writable
        });

        connectToDatabase.mockRejectedValue(new Error("Connection error")); // Mock connection failure

        const response = await request(app).get("/test");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to connect to the database");
    });

    it("should return a 500 error if dbInstance is null", async () => {
        // Mocking the readyState to 0 (not connected)
        Object.defineProperty(mongoose.connection, 'readyState', {
            value: 0,
            writable: true, // make it writable
        });

        connectToDatabase.mockResolvedValue(null); // Mock null db instance

        const response = await request(app).get("/test");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to connect to the database");
    });
});
