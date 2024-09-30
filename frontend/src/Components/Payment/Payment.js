import React from 'react';

//import { Link } from 'react-router-dom';

//Importing css file
import './Payment.css'

//importing icons
import user_icon from '../Assets/person.png'
import card_icon from '../Assets/card.png'
import bank_icon from '../Assets/bank.png'
import money_icon from '../Assets/money.png'

const Payment = () => {
    return (
        <div className='paymentContainer'>
            <div className="paymentHeader">
                <div className="paymentText"> Payment Portal</div>
                <div className="paymentUnderline"></div>
            </div>
            <div className="paymentInputs">

                <div className="paymentLabel">
                    <p>Recipient Name: </p>
                </div>

                <div className="paymentInput">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="  Recipient Name" />
                </div>

                <div className="paymentLabel">
                    <p>Recipient Bank: </p>
                </div>

                <div className="paymentInput">
                    <img src={bank_icon} alt="" />
                    <input type="text" placeholder="   Recipient Bank" />
                </div>

                <div className="paymentLabel">
                    <p>Recipients account no: </p>
                </div>

                <div className="paymentInput">
                    <img src={card_icon} alt="" />
                    <input type="password" placeholder="   Recipients Account No" />
                </div>

                <div className="paymentLabel">
                    <p>Amount to transfer: </p>
                </div>

                <div className="paymentInput">
                    <img src={money_icon} alt="" />
                    <input type="password" placeholder="   Amount to transfer" />
                </div>


            </div>
            <div className="paymentSubmit-container">
                <div className="paymentSubmit">Pay Now</div>
                <div className="paymentSubmit">Cancel</div>
            </div>

        </div>
    );
};

export default Payment;