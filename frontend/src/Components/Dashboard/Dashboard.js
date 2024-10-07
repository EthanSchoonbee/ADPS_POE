import React, { useEffect, useState } from "react"; //useEffect which will be used to check if the user is logged in or not
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Importing CSS file
import "./Dashboard.css";
import bank_icon from "../Assets/bank.png"; // Importing the bank image
import payment_icon from "../Assets/card.png"; // Importing the card icon

const Dashboard = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentReceipts, setShowPaymentReceipts] = useState(false);
    const [user, setUser] = useState(null);
    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [activeSection, setActiveSection] = useState("menu");
    const [authError, setAuthError] = useState(null);

    // Function to handle logout
    const handleLogout = () => {
        //removes the token from local storage
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login
    };

    // Effect to check authentication status and fetch user data
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== "user") {
                    setAuthError("You don't have permission to access this page.");
                    setTimeout(() => {
                        navigate("/EmployeeDash");
                    }, 3000); // Redirect after 3 seconds
                } else {
                    fetchUserData();
                    fetchUserPayments();
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate("/");
            }
        }
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:3001/api/auth/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data received:", response.data); // Log the received data
            if (response.data && response.data.user) {
                setUser(response.data.user);
            } else {
                throw new Error("User data not found in response");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch user data. Please try again.");
        }
    };

    const fetchUserPayments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            console.log("Fetching payments with token:", token);
            const response = await axios.get(
                "https://localhost:3001/api/transaction/user-payments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response from server:", response.data);

            if (response.data.payments) {
                setPayments(response.data.payments);
                console.log("Payments set:", response.data.payments);
            } else {
                setPayments([]);
                console.log("No payments found in response");
            }

            setLoading(false);
            setError(null);
        } catch (error) {
            console.error("Error fetching user payments:", error);
            setError("Failed to fetch payments. Please try again.");
            setPayments([]);
            setLoading(false);
        }
    };

    // Function to handle "Pay Again" button click
    const handlePayAgain = (payment) => {
        alert(`Initiating payment for: ${payment.reference}`);
        //will handle the payment again logic here
    };

    // Function to handle "Make Local Payment" button click
    const handleMakeLocalPayment = () => {
        navigate("/Payment");
        console.log("Navigating to Payment");
    };

    // Function to toggle account number visibility
    const toggleAccountNumber = () => {
        setShowAccountNumber(!showAccountNumber);
    };

    // Function to display account number
    const displayAccountNumber = (accountNumber) => {
        if (!accountNumber) return "Loading...";
        return showAccountNumber ? accountNumber : "XXXXXXXXXX";
    };

    const renderContent = () => {
        switch (activeSection) {
            case "menu":
                return (
                    <>
                        <div className="paymentButtons">
                            {/* Button to make local payment */}
                            <button className="paymentBtn" onClick={handleMakeLocalPayment}>
                                Make Local Payment
                            </button>
                            {/* Button to make international payment */}
                            <button className="paymentBtn" onClick={handleMakeLocalPayment}>
                                Make International Payment
                            </button>
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
                                <span>Acc No:</span> {displayAccountNumber(user?.accountNumber)}
                                <button
                                    onClick={toggleAccountNumber}
                                    className="toggleAccountBtn"
                                >
                                    {showAccountNumber ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* heading for payment receipts */}
                        <div className="paymentReceipts">
                            <img
                                src={payment_icon}
                                alt="Payment Card Icon"
                                className="cardIcon"
                            />
                            Payment Receipts
                        </div>

                        {/* Payment History */}
                        <div className="paymentHistoryContainer">
                            {loading && <p>Loading payments...</p>}
                            {error && <p className="error-message">{error}</p>}
                            {!loading && !error && payments.length === 0 && (
                                <p>No payment history available.</p>
                            )}
                            {payments.map((payment) => (
                                <div
                                    key={payment._id}
                                    className={`paymentReceipt ${
                                        payment.isValidated ? "validated" : "not-validated"
                                    }`}
                                >
                                    <div className="paymentInfo">
                    <span className="paymentDate">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                                        <span className="paymentReference">
                      Payment to : {payment.recipientName}
                    </span>
                                        {/* The amount that the user is sending */}
                                        <span className="paymentTotal">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </span>
                                    </div>
                                    {/* The status of the payment */}
                                    {payment.isValidated ? (
                                        // if the isValidated is true, then the payment is validated and the user can pay again
                                        <button
                                            className="payAgainBtn"
                                            onClick={() => handlePayAgain(payment)}
                                        >
                                            Pay Again
                                        </button>
                                    ) : (
                                        // if the isValidated is false, then the payment is not validated yet
                                        <span className="validationStatus">
                      Payment not validated yet
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                );
            case "transaction":
                return <div>Transaction content will go here... Be patient</div>;
            case "payments":
                return (
                    <div className="paymentsSection">
                        <h2>Payment Receipts</h2>
                        <div className="paymentHistoryContainer">
                            {loading && <p>Loading payments...</p>}
                            {error && <p className="error-message">{error}</p>}
                            {!loading && !error && payments.length === 0 && (
                                <p>No payment history available.</p>
                            )}
                            {payments.map((payment) => (
                                <div
                                    key={payment._id}
                                    className={`paymentReceipt ${
                                        payment.isValidated ? "validated" : "not-validated"
                                    }`}
                                >
                                    <div className="paymentInfo">
                    <span className="paymentDate">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                                        <span className="paymentReference">
                      Payment to : {payment.recipientName}
                    </span>
                                        {/* The amount that the user is sending */}
                                        <span className="paymentTotal">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </span>
                                    </div>
                                    {/* The status of the payment */}
                                    {payment.isValidated ? (
                                        // if the isValidated is true, then the payment is validated and the user can pay again
                                        <button
                                            className="payAgainBtn"
                                            onClick={() => handlePayAgain(payment)}
                                        >
                                            Pay Again
                                        </button>
                                    ) : (
                                        // if the isValidated is false, then the payment is not validated yet
                                        <span className="validationStatus">
                      Payment not validated yet
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboardContainer">
            {authError ? (
                <div className="error-container">
                    <div className="error-message">
                        <h2>Access Denied</h2>
                        <p>{authError}</p>
                        <p>Redirecting you to the Employee Dashboard...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="dashboardHeader">
                        <div className="dashboardText">Dashboard</div>
                        <div className="dashboardUnderline"></div>
                    </div>

                    <div className="dashboardContent">
                        <div className="mainSection">
                            {/* Left Section (Menu) */}
                            <div className="leftSection">
                                <div className="customerName">
                                    <h2>
                                        Hello, {user ? `${user.firstname} ${user.lastname}` : "User"}
                                    </h2>
                                </div>

                                <div className="verticalMenu">
                                    <div
                                        className={`menuItem ${
                                            activeSection === "menu" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveSection("menu")}
                                    >
                                        Menu
                                    </div>
                                    <div
                                        className={`menuItem ${
                                            activeSection === "transaction" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveSection("transaction")}
                                    >
                                        Transaction
                                    </div>
                                    <div
                                        className={`menuItem ${
                                            activeSection === "payments" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveSection("payments")}
                                    >
                                        Payments
                                    </div>
                                    <div className="logoutItem">
                                        <button onClick={handleLogout} className="logoutBtn">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section (Content) */}
                            <div className="rightSection">{renderContent()}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
