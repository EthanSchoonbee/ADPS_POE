import React, { useState } from 'react';


const CustomerDashboard = () => {
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [accountNumberVisible, setAccountNumberVisible] = useState(false);

    // Random available balance generation for the demo
    const availableBalance = `$${(Math.random() * 10000).toFixed(2)}`;

    return (
        <div className="dashboardContainer">
            {/* Header */}
            <div className="loginHeader">
                <h1 className="loginText">Employee Dashboard</h1>
                <div className="loginUnderline"></div>
                <p className="welcome-text">Hello, [Customer's Name]</p>
            </div>

            {/* Payment Options */}
            <div className="payment-options">
                <button className="payment-button">Make Local Payment</button>
                <button className="payment-button">Make International Payment</button>
            </div>

            {/* Banking Details */}
            <div className="banking-details">
                <h2 className="banking-header">Banking Details</h2>
                <p>
                    Acc No: {accountNumberVisible ? "123456789012" : "XXXXXXXXXXXX"}
                </p>
                <button className="toggle-button" onClick={() => setAccountNumberVisible(!accountNumberVisible)}>
                    {accountNumberVisible ? "Hide Account Number" : "Show Account Number"}
                </button>
                <p>Available Balance: {balanceVisible ? availableBalance : "XXXX.XX"}</p>
                <button className="toggle-button" onClick={() => setBalanceVisible(!balanceVisible)}>
                    {balanceVisible ? "Hide Balance" : "Show Balance"}
                </button>
            </div>

            {/* Payment Receipts */}
            <div className="payment-receipts">
                <h2 className="banking-header">Payment Receipts</h2>
                <div className="receipt">
                    <p>2024/08/20 - Sch Fees - $200</p>
                    <button className="pay-again-button">Pay Again</button>
                </div>
                <div className="receipt">
                    <p>2024/08/20 - Home R - $100</p>
                    <button className="pay-again-button">Pay Again</button>
                </div>
            </div>

            {/* Side Menu Buttons */}
            <div className="side-menu">
                <button className="side-button">Menu</button>
                <button className="side-button">Transactions</button>
                <button className="side-button">Payments</button>
            </div>
        </div>
    );
};

export default CustomerDashboard;
