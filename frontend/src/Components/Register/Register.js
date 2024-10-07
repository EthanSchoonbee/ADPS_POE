//Importing use state
import React, { useState } from 'react';

// Importing routing
import {Link, useNavigate} from 'react-router-dom';

// Importing css file
import './Register.css'

// Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'
import pencil_icon from '../Assets/pencil.png'
import card_icon from '../Assets/card.png'
import email_icon from '../Assets/email.png'
import axios from "axios";


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
                navigate('/Payment'); // Redirect to homepage or desired route
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
