import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.mjs';
import authRouter from '../routes/auth.mjs'; // Adjust the import path if necessary
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(30000);

let app;
let mongoServer;

let authToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri);

    app = express();
    app.use(express.json()); // Middleware to parse JSON
    app.use('/auth', authRouter); // Use the auth router
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllTimers();
});

describe('Auth Routes', () => {

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstname: 'Tester',
                lastname: 'Testie',
                email: 'test@example.com',
                username: 'testusername',
                idNumber: '0207025108081', // Make sure this is a valid format
                accountNumber: '1234567',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should not register a user with existing credentials', async () => {
        // Register a user first
        await request(app)
            .post('/auth/signup')
            .send({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@example.com',
                username: 'janedoe',
                idNumber: '0207025108082',
                accountNumber: '12345678',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });

        // Attempt to register the same user again
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@example.com',
                username: 'janedoe',
                idNumber: '0207025108082',
                accountNumber: '12345678',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/A user with this username, this email, this ID number and this account number already exists./);
    });

    it('should login a user', async () => {
        // Register a user first
        await request(app)
            .post('/auth/signup')
            .send({
                firstname: 'Alice',
                lastname: 'Smith',
                email: 'alice.smith@example.com',
                username: 'alicesmith',
                idNumber: '0207025108083',
                accountNumber: '123456789',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });

        // Now login
        const response = await request(app)
            .post('/auth/login')
            .send({
                identifier: 'alicesmith',
                password: 'Password123!',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        authToken = response.body.token;
    });

    it('should get the current user', async () => {
        console.log('Getting current user...');
        const response = await request(app)
            .get('/auth/user')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('firstname', 'Alice');
    });
});
