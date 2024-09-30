//Importing use state
import React, { useState } from 'react';

// Importing routing
import { Link } from 'react-router-dom';

// Importing css file
import './Register.css'

// Importing icons
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'
import pencil_icon from '../Assets/pencil.png'
import card_icon from '../Assets/card.png'
import email_icon from '../Assets/email.png'


const Register = () => {
    
    // State to handle visibility for both password fields
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    <input type="text" placeholder="   First Name" />
                </div>

                <div className="registerInput">
                    <img src={pencil_icon} alt="" />
                    <input type="text" placeholder="   Last Name" />
                </div>

                <div className="registerInput">
                    <img src={user_icon} alt="" />
                    <input type="username" placeholder="   Username" />
                </div>

                <div className="registerInput">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="   Email" />
                </div>

                <div className="registerInput">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="   ID Number" />
                </div>

                <div className="registerInput">
                    <img src={card_icon} alt="" />
                    <input type="text" placeholder="   Account Number" />
                </div>

                <div className="registerInput">
                    <img src={password_icon} alt="" />
                    {/* Implementing password visibility */}
                    <input type={showPassword ? "text" : "password"} placeholder="   Password" />
                    <div className="showHideLabel">
                        <label style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </label>
                    </div>
                </div>

                <div className="registerInput">
                    <img src={password_icon} alt="" />
                    {/* Implementing password visibility */}
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="   Confirm Password" />
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
                <div className="registerSubmit">Register</div>
            </div>

        </div>
    );
};

export default Register;
