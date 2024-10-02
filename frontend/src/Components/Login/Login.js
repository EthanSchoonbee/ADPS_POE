import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

//Importing css file
import './Login.css'

//Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'

const Login = () => {

    //State to handle visibility for the password field
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message,setMessage] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await axios.post('https://localhost:3001/api/auth/login', {
                identifier: username,
                password: password
            });

            const { token }= response.data;

            if (token) {
                localStorage.setItem('token', token);
                setMessage({ text: "Successfully logged in!", type: "success" });
                navigate('/Payment'); // Redirect to homepage or desired route
            } else {
                setMessage({ text: 'Login failed: Invalid credentials!', type: "error" });
            }

        } catch(err) {
            const errorMessage = err.response?.data?.error || "An unexpected error occurred. Please try again.";
            setMessage({ text: errorMessage, type: "error" });
        }
    }

    return (
        <div className='loginContainer'>
            <div className="loginHeader">
                <div className="loginText"> Login</div>
                <div className="loginUnderline"></div>
            </div>

            <div className="loginInputs">
                <div className="loginInput">
                    <img src={user_icon} alt=""/>
                    <input
                        type="username"
                        placeholder="   Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="loginInput">
                    <img src={password_icon} alt=""/>
                    {/* Implementing password visibility */}
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="   Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="showHideLabel">
                        <label style={{cursor: 'pointer'}} onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </label>
                    </div>
                </div>
            </div>

            <div className="loginSubmit-container">
                <p>
                    Don't have an account? <Link to="/register">Click here to register</Link>
                </p>
                <div className="loginSubmit" onClick={handleLogin}>Login</div>
            </div>

            {message && (
                <p className={message.type === "success" ? "success-message" : "error-message"}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default Login;
