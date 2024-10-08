//Importing use state
import React, { useState } from 'react';

// Importing routing
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";

// Importing css file
import './Register.css'

// Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'
import pencil_icon from '../Assets/pencil.png'
import card_icon from '../Assets/card.png'
import email_icon from '../Assets/email.png'

// regex pattern for sanitizing all the input. will prevent any malicious code from being entered. Such as <script>alert("XSS")</script>
const inputSanitizationRegex =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|EXEC|UNION|CREATE|ALTER|SCRIPT|SRC|IMG|ONERROR|ONLOAD|ONCLICK|ALERT|PROMPT|EVAL)\b)|[^a-zA-Z0-9\s\.,;:\?!'\"()\-@#$%&*+\/=~|^{}[\]<>]/i;

const Register = () => {
    
    // State to handle visibility for both password fields
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [message,setMessage] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);

        // helper function to validate fields
        const validateInput = (input) => !inputSanitizationRegex.test(input);

        // validate all inputs
        const isFirstNameValid = validateInput(firstName);
        const isLastNameValid = validateInput(lastName);
        const isUsernameValid = validateInput(username);
        const isEmailValid = validateInput(email);
        const isIdNumberValid = validateInput(idNumber);
        const isAccountNumberValid = validateInput(accountNumber);
        const isPasswordValid = validateInput(password);
        const isConfirmPasswordValid = validateInput(confirmPassword);

        // array to hold invalid fields
        const invalidFields = [];

        // check for any invalid fields and add them to the array
        if (!isFirstNameValid) invalidFields.push('First Name');
        if (!isLastNameValid) invalidFields.push('Last Name');
        if (!isUsernameValid) invalidFields.push('Username');
        if (!isEmailValid) invalidFields.push('Email');
        if (!isIdNumberValid) invalidFields.push('ID Number');
        if (!isAccountNumberValid) invalidFields.push('Account Number');
        if (!isPasswordValid) invalidFields.push('Password');
        if (!isConfirmPasswordValid) invalidFields.push('Confirm Password');

        // if any fields are invalid, display error and clear those fields
        if (invalidFields.length > 0) {
            setMessage({
                text: `Potential attack detected in: ${invalidFields.join(', ')}. Input sanitized.`,
                type: "error",
            });

            // clear all invalid fields
            if (!isFirstNameValid) setFirstName('');
            if (!isLastNameValid) setLastName('');
            if (!isUsernameValid) setUsername('');
            if (!isEmailValid) setEmail('');
            if (!isIdNumberValid) setIdNumber('');
            if (!isAccountNumberValid) setAccountNumber('');
            if (!isPasswordValid) setPassword('');
            if (!isConfirmPasswordValid) setConfirmPassword('');

            return;
        }

        try {
            const response = await axios.post('https://localhost:3001/api/auth/signup', {
                firstname: firstName,
                lastname: lastName,
                email: email,
                username: username,
                password: password,
                confirmPassword: confirmPassword,
                accountNumber: accountNumber,
                idNumber: idNumber
            });

            const { token }= response.data;

            if (token) {
                localStorage.setItem('token', token);
                setMessage({ text: "Successfully registered!", type: "success" });
                navigate('/Dashboard'); // Redirect to homepage or desired route
            } else {
                setMessage({ text: 'Registration failed', type: "error" });
            }

        } catch(err) {
            const errorMessage = err.response?.data?.error || "An unexpected error occurred. Please try again.";
            setMessage({ text: errorMessage, type: "error" });
        }
    }

    return (
        <div className='registerContainer'>
            <div className="registerHeader">
                <div className="registerText"> Register</div>
                <div className="registerUnderline"></div>
            </div>
            <div className="registerInputs">

                <div className="registerInput">
                    <img src={pencil_icon} alt="" />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={pencil_icon} alt=""/>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={user_icon} alt="" />
                    <input
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={email_icon} alt="" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={user_icon} alt="" />
                    <input
                        type="text"
                        placeholder="ID Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={card_icon} alt="" />
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                </div>

                <div className="registerInput">
                    <img src={password_icon} alt="" />
                    {/* Implementing password visibility */}
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="showHideLabel">
                        <label style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </label>
                    </div>
                </div>

                <div className="registerInput">
                    <img src={password_icon} alt="" />
                    {/* Implementing password visibility */}
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="showHideLabel">
                        <label style={{ cursor: 'pointer' }} onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </label>
                    </div>
                </div>

            </div>
            <div className="registerSubmit-container">
                <p>
                    Already have an account? <Link to="/">Click here to login</Link>
                </p>
                <div className="registerSubmit" onClick={handleRegister}>Register</div>
            </div>

            {message && (
                <p className={message.type === "success" ? "success-message" : "error-message"}>
                    {message.text}
                </p>
            )}

        </div>
    );
};

export default Register;
