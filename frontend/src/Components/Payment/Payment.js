import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Importing icons
import user_icon from "../Assets/person.png";
import card_icon from "../Assets/card.png";
import bank_icon from "../Assets/bank.png";
import money_icon from "../Assets/money.png";
import currency_icon from "../Assets/currency.png";

//creating a regex for the account number that is similar to the one in the backend
const accountNumberRegex = /^\d{7,11}$/;

// Add this regex pattern at the top of your file
const amountRegex = /^(\d+(\.\d{1,2})?)$/;

const Payment = () => {
    // State to manage selected bank, SWIFT code, currency symbol, and payment amount
    const [selectedBank, setSelectedBank] = useState("FNB");
    const [swiftCode, setSwiftCode] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("R");
    const [paymentAmount, setPaymentAmount] = useState("R ");
    const [recipientName, setRecipientName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Set default values
    const [selectedCurrency, setSelectedCurrency] = useState("ZAR");

    // Assigning swift codes to banks
    const bankSwiftCodes = {
        STANDARD_BANK: "SBZAZAJJ",
        ABSA: "ABSAZAJJ",
        FNB: "FIRNZAJJ",
        CAPITEC: "CABLZAJJ",
        NEDBANK: "NEDSZAJJ",
    };

    // Assigning symbols to currencies
    const currencySymbols = {
        ZAR: "R",
        USD: "$",
        GBP: "£",
    };

    //State that will manage showing the success alert for when payment is successful
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setSwiftCode(bankSwiftCodes[selectedBank] || "");
    }, []);

    // Handle bank selection and update SWIFT code
    const handleBankChange = (event) => {
        const bank = event.target.value;
        setSelectedBank(bank);
        setSwiftCode(bankSwiftCodes[bank] || "");
    };

    // Handle currency selection and update currency symbol
    const handleCurrencyChange = (event) => {
        const currency = event.target.value;
        setSelectedCurrency(currency);
        const symbol = currencySymbols[currency] || "";
        setCurrencySymbol(symbol);
        setPaymentAmount(`${symbol} `);
    };

    // Format the number with spaces for thousands, millions
    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Handle payment amount input and ensure symbol stays in front
    const handlePaymentAmountChange = (event) => {
        let value = event.target.value
            .replace(currencySymbol, "")
            .replace(/[^\d.]/g, "");

        // If the value is empty, set the amount to the currency symbol
        if (value === "") {
            setPaymentAmount(`${currencySymbol} `);
        } else if (amountRegex.test(value)) {
            value = formatNumber(value);
            setPaymentAmount(`${currencySymbol} ${value}`);
        }
    };

    //handling front and back connection
    const handlePayment = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Remove currency symbol and all spaces, then trim
        const numericAmount = paymentAmount
            .replace(currencySymbol, "")
            .replace(/\s/g, "")
            .trim();

        // Check if the amount is empty
        if (!numericAmount) {
            setMessage({
                text: "Please enter a payment amount",
                type: "error",
            });
            return;
        }

        // Use a regex that allows for any number of digits, with optional decimal places
        const amountRegex = /^\d+(\.\d{1,2})?$/;

        // Check if the amount is a valid number and matches the regex patter
        if (!amountRegex.test(numericAmount)) {
            setMessage({
                //will tell the user to enter a valid payment amount
                text: "Please enter a valid payment amount",
                type: "error",
            });
            return;
        }

        // Parse the amount to a float
        const parsedAmount = parseFloat(numericAmount);

        //if the amount is not a number and is less than or equal to 0 then will display an error
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setMessage({
                //the payment amount must be greater than 0
                text: "Payment amount must be greater than 0",
                type: "error",
            });
            return;
        }

        setMessage("making payment");

        // Get the token from local storage
        const token = localStorage.getItem("token");
        //if the token is not present then will display an error message
        //and log user out
        if (!token) {
            //will display an error message
            setMessage({
                text: "You must be logged in to make a payment",
                type: "error",
            });
            navigate("/login"); //log user out
            return;
        }

        //log the token
        console.log("Token:", token);

        const payload = {
            amount: parsedAmount.toFixed(2), // Ensure two decimal places
            currency: currencySymbols[selectedCurrency],
            bank: selectedBank,
            recipientAccountNo: accountNumber,
            recipientName: recipientName,
        };

        // Log the payload being sent to the backend
        console.log("Payload being sent:", payload);

        try {
            //submitting the payload to the backend
            const response = await axios.post(
                "https://localhost:3001/api/transaction/payment",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage({ text: response.data.message, type: "success" });
            setShowModal(true);

            // Clear input boxes and close modal after 3 seconds
            setTimeout(() => {
                setPaymentAmount(`${currencySymbol} `);
                setRecipientName("");
                setAccountNumber("");
                setShowModal(false);
            }, 3000);
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                "An unexpected error occurred. Please try again.";
            setMessage({ text: errorMessage, type: "error" });
        }
    };

    // creating a function to handle when the account number is changed
    const handleAccountNumberChange = (e) => {
        //getting the value of the account number
        const value = e.target.value;
        //setting the account number to the value
        setAccountNumber(value);

        //if there is a value and the account number does not match the regex pattern then will display an error
        if (value && !accountNumberRegex.test(value)) {
            setMessage({
                //the account number should be between 7 and 11 digits
                text: "Account number should be between 7 and 11 digits.",
                type: "error",
            });
        } else {
            //will set the message to null
            setMessage(null);
        }
    };

    //This function handles when the cancel button is clicked
    const handleCancel = () => {
        navigate("/Dashboard"); //will redirect the user to the dashboard
    };

    return (
        <div className="paymentContainer">
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
                    <select
                        //dropbox for the currency
                        className="paymentDropbox"
                        //handling the change of the currency
                        onChange={handleCurrencyChange}
                        value={selectedCurrency}
                    >
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
                    <select
                        className="paymentDropbox"
                        //handling the change of the bank
                        onChange={handleBankChange}
                        value={selectedBank}
                    >
                        <option value="STANDARD_BANK">Standard Bank</option>
                        <option value="ABSA">ABSA</option>
                        <option value="FNB">FNB</option>
                        <option value="CAPITEC">Capitec</option>
                        <option value="NEDBANK">Nedbank</option>
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
                        placeholder="SWIFT Code"
                        readOnly
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
                        onChange={handleAccountNumberChange}
                        placeholder="Recipient's Account No"
                    />
                </div>
            </div>
            {/* Buttons */}

            <div className="paymentSubmit-container">
                <div className="paymentSubmit" onClick={handlePayment}>
                    Pay Now
                </div>
                {/* Button to cancel the payment */}
                <div className="paymentSubmit" onClick={handleCancel}>
                    Cancel
                </div>
            </div>

            {/*will display the message here*/}
            {message && (
                <p
                    className={
                        message.type === "success" ? "success-message" : "error-message"
                    }
                >
                    {message.text}
                </p>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Payment Successful!</h2>
                        <p>Your payment has been processed successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
