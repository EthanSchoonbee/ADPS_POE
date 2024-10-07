import React, { useState } from 'react';
import './CustomerDash.css'; // Assuming you have a CSS file for styling

const CustomerDashboard = () => {
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [accountNumberVisible, setAccountNumberVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('localPayment'); // Tracks current selected menu item

    // Random available balance generation for the demo
    const availableBalance = `$${(Math.random() * 10000).toFixed(2)}`;

    // Menu button click handler to set the active state
    const handleMenuClick = (menuItem) => {
        setSelectedMenu(menuItem);
    };

    return (
        <div className="dashboard-container">
            {/* Left-side Menu Buttons */}
            <div className="menu-container">
                <button
                    className={`menu-button ${selectedMenu === 'localPayment' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('localPayment')}
                >
                    Make Local Payment
                </button>
                <button
                    className={`menu-button ${selectedMenu === 'internationalPayment' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('internationalPayment')}
                >
                    Make International Payment
                </button>
                <button
                    className={`menu-button ${selectedMenu === 'bankingDetails' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('bankingDetails')}
                >
                    View Banking Details
                </button>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Header */}
                <h1 className="header-text">Customer Dashboard</h1>
                <p className="welcome-text">Hello, [Customer's Name]</p>

                {/* Conditional Rendering based on selected menu */}
                {selectedMenu === 'localPayment' && (
                    <div className="payment-content">
                        <h2>Local Payment</h2>
                        <p>Select options for local payments.</p>
                    </div>
                )}

                {selectedMenu === 'internationalPayment' && (
                    <div className="payment-content">
                        <h2>International Payment</h2>
                        <p>Select options for international payments.</p>
                    </div>
                )}

                {selectedMenu === 'bankingDetails' && (
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
                )}

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
            </div>
        </div>
    );
};

export default CustomerDashboard;
