import React, { useState } from 'react';
import './Payment.css';

//importing icons
import user_icon from '../Assets/person.png';
import card_icon from '../Assets/card.png';
import bank_icon from '../Assets/bank.png';
import money_icon from '../Assets/money.png';
import currency_icon from '../Assets/currency.png';

const Payment = () => {
    // State to manage selected bank and SWIFT code
    const [selectedBank, setSelectedBank] = useState('');
    const [swiftCode, setSwiftCode] = useState('');

    // Object mapping banks to SWIFT codes
    const bankSwiftCodes = {
        "Standard Bank": "SBZAZAJJ",
        "ABSA": "ABSAZAJJ",
        "FNB": "FIRNZAJJ",
        "Capitec": "CABLZAJJ",
        "Nedbank": "NEDSZAJJ"
    };

    // Handle bank selection and update SWIFT code
    const handleBankChange = (event) => {
        const bank = event.target.value;
        setSelectedBank(bank);
        setSwiftCode(bankSwiftCodes[bank] || '');  // Set SWIFT code or empty if bank not found
    };

    return (
        <div className='paymentContainer'>
            <div className="paymentHeader">
                <div className="paymentText"> Payment Portal</div>
                <div className="paymentUnderline"></div>
            </div>

            <div className="paymentInputs">

                {/*Payment Amount*/}
                <div className="paymentLabel">
                    <p>Payment Amount: </p>
                </div>
                <div className="paymentInput">
                    <img src={money_icon} alt="" />
                    <input type="text" placeholder="  Payment Amount:" />
                </div>

                {/*Transaction currency*/}
                <div className="paymentLabel">
                    <p>Transaction Currency: </p>
                </div>
                <div className="paymentInput">
                    <img src={currency_icon} alt="" />
                    <select className="paymentDropbox">
                        <option value="ZAR">ZAR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>

                {/*Provider*/}
                <div className="paymentLabel">
                    <p>Provider: </p>
                </div>
                <div className="paymentInput">
                    <img src={bank_icon} alt="" />
                    <select className="paymentDropbox" onChange={handleBankChange}>
                        <option value="Standard Bank">Standard Bank</option>
                        <option value="ABSA">ABSA</option>
                        <option value="FNB">FNB</option>
                        <option value="Capitec">Capitec</option>
                        <option value="Nedbank">Nedbank</option>
                    </select>
                </div>

                {/*SWIFT Code*/}
                <div className="paymentLabel">
                    <p>SWIFT code: </p>
                </div>
                <div className="paymentInput">
                    <img src={bank_icon} alt="" />
                    <input type="text" value={swiftCode} placeholder="SWIFT Code" readOnly />
                </div>

                {/*Recipient name*/}
                <div className="paymentLabel">
                    <p>Recipient Name: </p>
                </div>
                <div className="paymentInput">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="  Recipient Name:" />
                </div>

                {/*Recipient bank*/}
                <div className="paymentLabel">
                    <p>Recipient Bank: </p>
                </div>
                <div className="paymentInput">
                    <img src={bank_icon} alt="" />
                    <input type="password" placeholder="Recipient Bank" />
                </div>
            

                {/*Recipient account number*/}
                <div className="paymentLabel">
                    <p>Recipient's account no: </p>
                </div>
                <div className="paymentInput">
                    <img src={card_icon} alt="" />
                    <input type="password" placeholder="Recipient's Account No" />
                </div>

                </div>

            {/*Buttons*/}
            <div className="paymentSubmit-container">
                <div className="paymentSubmit">Pay Now</div>
                <div className="paymentSubmit">Cancel</div>
            </div>
        </div>
    );
};

export default Payment;
