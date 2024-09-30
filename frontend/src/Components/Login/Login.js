import React, { useState } from 'react';

import { Link } from 'react-router-dom';

//Importing css file
import './Login.css'

//Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'

const Login = () => {

    //State to handle visibility for the password field
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className='loginContainer'>
            <div className="loginHeader">
                <div className="loginText"> Login</div>
                <div className="loginUnderline"></div>
            </div>

            <div className="loginInputs">
                <div className="loginInput">
                    <img src={user_icon} alt="" />
                    <input type="username" placeholder="   Username" />
                </div>

                <div className="loginInput">
                    <img src={password_icon} alt="" />
                    {/* Implementing password visibility */}
                    <input type={showPassword ? "text" : "password"} placeholder="   Password" />
                    <div className="showHideLabel">
                        <label style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </label>
                    </div>
                </div>
            </div>

            <div className="loginSubmit-container">
                <p>
                    Don't have an account? <Link to="/register">Click here to register</Link>
                </p>
                <div className="loginSubmit">Login</div>
            </div>
        </div>
    );
};

export default Login;
