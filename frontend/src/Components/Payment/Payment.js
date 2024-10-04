import React, { useState } from 'react';
import './Payment.css';
import {Link, useNavigate} from 'react-router-dom';

// Importing icons
import user_icon from '../Assets/person.png';
import card_icon from '../Assets/card.png';
import bank_icon from '../Assets/bank.png';
import money_icon from '../Assets/money.png';
import currency_icon from '../Assets/currency.png';
import axios from "axios";

const Payment = () => {
    // State to manage selected bank, SWIFT code, currency symbol, and payment amount
    const [selectedBank, setSelectedBank] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [message,setMessage] = useState(null);
    const navigate = useNavigate();

    // Assigning swift codes to banks
    const bankSwiftCodes = {
        "Standard Bank": "SBZAZAJJ",
        "ABSA": "ABSAZAJJ",
        "FNB": "FIRNZAJJ",
        "Capitec": "CABLZAJJ",
        "Nedbank": "NEDSZAJJ"
    }

    // Assigning symbols to currencies
    const currencySymbols = {
        "ZAR": "R",
        "USD": "$",
        "GBP": "£"
    }

    // Handle bank selection and update SWIFT code
    const handleBankChange = (event) => {
        const bank = event.target.value;
        setSelectedBank(bank);
        setSwiftCode(bankSwiftCodes[bank] || '');
    }

    // Handle currency selection and update currency symbol
    const handleCurrencyChange = (event) => {
        const currency = event.target.value;
        setCurrencySymbol(currencySymbols[currency] || '');
        setPaymentAmount('');
    }

    // Format the number with spaces for thousands, millions
    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Handle payment amount input and ensure symbol stays in front
    const handlePaymentAmountChange = (event) => {
        let value = event.target.value.replace(currencySymbol, '').replace(/[^\d.]/g, '');
        if (!isNaN(value) && value !== '') {
            value = formatNumber(value);
            setPaymentAmount(`${currencySymbol} ${value}`);
        } else {
            setPaymentAmount(`${currencySymbol} `);
        }
    }



    //handling front and back connection
    const handlePayment = async (e) => {
        e.preventDefault();
        setMessage(null);

        setMessage("making payment");

        const formattedAmount = paymentAmount.replace(/[^0-9.]/g, ''); // Removes any non-numeric characters
        const selectedCurrency = currencySymbol; // Ensure this is one of the allowed values (ZAR, USD, GBP)

        const payload = {
            amount: formattedAmount, // Ensure this is a string in the format expected by your schema
            currency: selectedCurrency, // This should be one of the allowed values
            bank: selectedBank, // This should also match one of the specified banks
            recipientAccountNo: accountNumber, // Should match the regex for a valid account number
            recipientName: recipientName // Ensure this is a non-empty string
        }

        console.log("Payload being sent:", payload);

        try {
            const response = await axios.post('https://localhost:3001/api/transaction/payment', payload);
            setMessage({ text: response.data.message, type: "success" });
        } catch(err) {
            const errorMessage = err.response?.data?.error || "An unexpected error occurred. Please try again.";
            setMessage({ text: errorMessage, type: "error" });
        }
    }



    return (
        <div className='paymentContainer'>
            <div className="paymentHeader">
                <div className="paymentText"> Payment Portal</div>
                <div className="paymentUnderline"></div>
            </div>

            <div className="paymentInputs">

                {/* Transaction currency */}
                <div className="paymentLabel">
                    <p>Transaction Currency: </p>
                </div>
                <div className="paymentInput">
                    <img src={currency_icon} alt="" />
                    <select className="paymentDropbox" onChange={handleCurrencyChange}>
                        <option value="ZAR">ZAR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>

                {/* Payment Amount */}
                <div className="paymentLabel">
                    <p>Payment Amount: </p>
                </div>
                <div className="paymentInput">
                    <img src={money_icon} alt="" />
                    <input
                        type="text"
                        value={paymentAmount}
                        onChange={handlePaymentAmountChange}
                        placeholder="Payment Amount:"
                    />
                </div>


                {/* Recipient bank */}
                <div className="paymentLabel">
                    <p>Recipient Bank: </p>
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

                {/* SWIFT Code */}
                <div className="paymentLabel">
                    <p>Provider (SWIFT code): </p>
                </div>
                <div className="paymentInput">
                    <img src={bank_icon} alt="" />
                    <input
                        type="text"
                        value={swiftCode}
                        placeholder="SWIFT Code" readOnly
                    />
                </div>

                {/* Recipient name */}
                <div className="paymentLabel">
                    <p>Recipient Name: </p>
                </div>
                <div className="paymentInput">
                    <img src={user_icon} alt="" />
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)} 
                        placeholder="  Recipient Name:"
                    />
                </div>

                {/* Recipient account number */}
                <div className="paymentLabel">
                    <p>Recipient's account no: </p>
                </div>
                <div className="paymentInput">
                    <img src={card_icon} alt="" />
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Recipient's Account No"
                    />
                </div>
            </div>
            {/* Buttons */}

            <div className="paymentSubmit-container">
                <div className="paymentSubmit" onClick={handlePayment}>Pay Now</div>
                <div className="paymentSubmit">Cancel</div>
            </div>

            {message && (
                <p className={message.type === "success" ? "success-message" : "error-message"}>
                    {message.text}
                </p>
            )}

        </div>
    );
};

export default Payment;




