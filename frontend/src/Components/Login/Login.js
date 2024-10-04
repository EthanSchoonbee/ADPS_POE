import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
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
        console.log("button clicked");

        try {
            const response = await axios.post('https://localhost:3001/api/auth/login', {
                identifier: username,
                password: password
            });

            console.log("got response");
            //Extracting the token and the role of the user
            const { token }= response.data;

            console.log("extracted token");
            console.log(token);

            if (token) {
                localStorage.setItem('token', token);

                console.log("stored token");

                // decode jwt and get user role for page navigation
                const decodedToken = jwtDecode(token);
                console.log(`decoded token: ${decodedToken}`);

                const { id, role } = decodedToken;
                console.log(`extracted user role : ${role}`);
                console.log(`extracted user id : ${id}`);

                setMessage({ text: "Successfully logged in!", type: "success" });

                // redirect the user based on their specific role
                if(role === "employee"){
                    console.log("navigating to employee dashboard");
                    // navigate the employee dashboard
                    navigate('/EmployeeDash');
                }else{
                    console.log("navigating to payment portal");
                    // navigate to the customer dashboard
                    navigate('/Payment');
                }
            } else {
                // failed to fetch valid token
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
