// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import Login from '../src/Components/Login/Login.js'; // Adjust the import based on your file structure
import axios from 'axios';
import '@testing-library/jest-dom';


// Mock axios
jest.mock('axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Login Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        // Clear the localStorage before each test
        jest.resetAllMocks();
        localStorage.clear();
    });

    test('renders login fields and button', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
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

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByTestId('login-button'));

        const errorMessage = await screen.findByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    /*test('shows success message on successful login', async () => {
        // Mock API response for valid credentials
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                response: { data: { token: 'fake-jwt-token' } },
            })
        );

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validPassword' } });
        fireEvent.click(screen.getByTestId('login-button'));

        // Check that the success message is in the document
        const successMessage = await screen.findByText('Successfully logged in!');
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveClass('success-message');
    });*/

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

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByTestId('login-button'));

        const lockoutMessage = await screen.findByText(/Too many login attempts/);
        expect(lockoutMessage).toBeInTheDocument();
    });
});
