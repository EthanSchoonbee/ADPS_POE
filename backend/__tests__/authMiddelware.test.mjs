import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { auth, checkRole } from '../middleware/authMiddleware.mjs'; // Adjust the path as needed

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Setup a test route
app.get('/protected', auth, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user });
});

// Test role checking middleware
app.get('/admin', auth, checkRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
});

// Test data
const testUser = {
    id: 'userId123',
    role: 'admin'
};

// Utility function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
};

describe('Auth Middleware', () => {
    it('should deny access without a token', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No token provided, authorisation denied');
    });

    it('should deny access with an invalid token', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorised');
    });

    it('should allow access with a valid token', async () => {
        const token = generateToken(testUser);
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access granted');
        expect(response.body.user).toEqual(expect.objectContaining(testUser));
    });

    it('should deny access if user role is not allowed', async () => {
        const token = generateToken({ id: 'userId123', role: 'user' }); // Not an admin
        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied. You do not have the required permissions');
    });

    it('should allow access if user role is allowed', async () => {
        const token = generateToken(testUser); // Admin role
        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin access granted');
    });
});
