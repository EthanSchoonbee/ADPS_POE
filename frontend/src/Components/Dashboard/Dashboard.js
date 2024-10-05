import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importing CSS file
import './Dashboard.css';
import bank_icon from '../Assets/bank.png'; // Importing the bank image
import payment_icon from '../Assets/card.png'; // Importing the card icon

const Dashboard = () => {
    const navigate = useNavigate();

    // Hardcoded user data for now
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        accountNumber: '1234567890',
        balance: '10,000.00', // Example balance
    };

    // Hardcoded payment data (replace this with real data)
    const payments = [
        { date: '2024-09-01', reference: 'Payment to John Smith', total: 'R1,000.00' },
        { date: '2024-09-15', reference: 'Payment to Sarah Brown', total: 'R500.00' },
        { date: '2024-09-22', reference: 'Payment to Mike Johnson', total: 'R2,500.00' }
    ];

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login
    };

    // Function to handle "Pay Again" button click
    const handlePayAgain = (payment) => {
        alert(`Initiating payment for: ${payment.reference}`);
        // Logic to trigger the payment process can go here
    };

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeader">
                <div className="dashboardText">Dashboard</div>
                <div className="dashboardUnderline"></div>
            </div>

            <div className="dashboardContent">
                <div className="mainSection">
                    {/* Left Section (Menu) */}
                    <div className="leftSection">
                        <div className="customerName">
                            <h2>Hello, {user.name}</h2>
                        </div>

                        <div className="verticalMenu">
                            <div className="menuItem">Menu</div>
                            <div className="menuItem">Transaction</div>
                            <div className="menuItem">Payments</div>
                            <div className="logoutItem">
                                <button onClick={handleLogout} className="logoutBtn">Logout</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section (Buttons and placeholders) */}
                    <div className="rightSection">
                        <div className="paymentButtons">
                            <button className="paymentBtn">Make Local Payment</button>
                            <button className="paymentBtn">Make International Payment</button>
                        </div>

                        {/* Placeholder Containers */}
                        <div className="bankingDetails">
                            <img src={bank_icon} alt="Bank Icon" className="bankIcon" />
                            Banking Details
                        </div>

                        {/* Account Details Section */}
                        <div className="accountDetails">
                            <div>
                                <span>Current Account</span>
                            </div>
                            <div>
                                <span>Acc No:</span> {user.accountNumber}
                            </div>
                            <div>
                                <span>Available Balance:</span> R{user.balance}
                            </div>
                        </div>

                        <div className="paymentReceipts">
                            <img src={payment_icon} alt="Payment Card Icon" className="cardIcon" />
                            Payment Receipts
                        </div>

                        {/* Payment History */}
                        <div className="paymentHistoryContainer">
                            {payments.map((payment, index) => (
                                <div key={index} className="paymentReceipt">
                                    <div className="paymentInfo">
                                        <span className="paymentDate">{payment.date}</span>
                                        <span className="paymentReference">{payment.reference}</span>
                                        <span className="paymentTotal">R{payment.total}</span>
                                    </div>
                                    <button className="payAgainBtn" onClick={() => handlePayAgain(payment)}>
                                        Pay Again
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
