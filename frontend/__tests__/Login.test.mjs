// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../src/Components/Login/Login.js'; // Adjust the import based on your file structure
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Login Component', () => {
    beforeEach(() => {
        // Clear the localStorage before each test
        localStorage.clear();
    });

    test('renders login fields and button', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText('   Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('   Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
    });

    test('shows error message for invalid credentials', async () => {
        // Mock the axios.post method to return a failed response
        axios.post.mockImplementationOnce(() =>
            Promise.reject({ response: { data: { error: 'Invalid credentials' } } })
        );

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('   Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('   Password'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByText('Login'));

        const errorMessage = await screen.findByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    test('shows success message and redirects for valid credentials', async () => {
        // Mock the axios.post method to return a successful response
        const mockToken = 'mock.jwt.token';
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({ data: { token: mockToken } })
        );

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('   Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('   Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(localStorage.getItem('token')).toBe(mockToken));

        // Check if navigation occurs based on user role (you might need to mock the navigate function too)
        // You can also assert any success message displayed on the screen
        const successMessage = await screen.findByText('Successfully logged in!');
        expect(successMessage).toBeInTheDocument();
    });

    test('shows lockout message after too many attempts', async () => {
        // Mock the axios.post method to simulate a lockout scenario
        axios.post.mockImplementationOnce(() =>
            Promise.reject({ response: { status: 429, data: { error: { nextValidRequestDate: new Date(Date.now() + 30000).toISOString() } } } })
        );

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('   Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('   Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByText('Login'));

        const lockoutMessage = await screen.findByText(/Too many login attempts/);
        expect(lockoutMessage).toBeInTheDocument();
    });
});
