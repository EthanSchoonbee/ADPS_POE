import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
//Importing css file
import '../Login/Login.css';
//Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'

const Login = () => {

    //State to handle visibility for the password field
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message,setMessage] = useState(null);
    const [canLogin, setCanLogin] = useState(true)
    const [retryAfter, setRetryAfter] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    // bruteforce timer prevention
    useEffect(() => {
        // if there is a retry timer start a countdown
        if (retryAfter) {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const timeLeft = retryAfter - now;

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    setCanLogin(true);
                    setMessage(null);
                    setRetryAfter(null);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [retryAfter]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        console.log("button clicked");

        // check if the user cannot log in
        if (!canLogin) {
            const now = new Date().getTime();
            const timeLeft = Math.ceil((retryAfter - now) / 1000);
            setMessage({ text: `Please wait before trying to log in again. ${timeLeft} seconds.`, type: "error" });
            return;
        }

        try {
            const response = await axios.post('https://localhost:3001/api/auth/login', {
                identifier: username,
                password: password
            });

            //Extracting the token and the role of the user
            const { token }= response.data;

            console.log(token);

            if (token) {
                localStorage.setItem('token', token);

                // decode jwt and get user role for page navigation
                const decodedToken = jwtDecode(token);

                const { id, role } = decodedToken;

                console.log(`extracted user role : ${role}`);
                console.log(`extracted user id : ${id}`);

                setMessage({ text: "Successfully logged in!", type: "success" });

                // redirect the user based on their specific role
                if(role === "employee"){
                    // navigate the employee dashboard
                    navigate('/EmployeeDash');
                }else{
                    // navigate to the customer dashboard
                    navigate('/Dashboard');
                }
            } else {
                // failed to fetch valid token
                setMessage({ text: 'Login failed: Invalid credentials!', type: "error" });
            }

        } catch(err) {
            // Check if the error response indicates that the rate limit has been exceeded
            if (err.response && err.response.status === 429) {
                // handle specific error response when rate limit is exceeded
                const { error } = err.response.data;

                // get the next valid login attempt time
                const nextValidRequestDate = new Date(error.nextValidRequestDate).getTime();
                setCanLogin(false); // prevent further login attempts
                setRetryAfter(nextValidRequestDate); // time until next retry
                const timeUntilRetry = (nextValidRequestDate - new Date().getTime()) / 1000; // time in seconds

                // display lockout message
                setMessage({ text: `Too many login attempts. Please try again after ${Math.ceil(timeUntilRetry)} seconds.`, type: "error" });
            } else {
                // Fallback for unexpected errors
                const errorMessage = err.response?.data?.error || "An unexpected error occurred. Please try again.";
                setMessage({ text: errorMessage, type: "error" });
            }
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
