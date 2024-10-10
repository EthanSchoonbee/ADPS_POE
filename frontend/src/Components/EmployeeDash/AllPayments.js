import React, { useState } from "react";
import "./AllPayments.css"; // We'll create this CSS file for styling

//All payments menu For the Employee. that uses Payments data to display all the payments
const AllPayments = ({ payments }) => {
    const [filter, setFilter] = useState("all");

    const filteredPayments = payments.filter((payment) => {
        if (filter === "verified") return payment.isValidated;
        if (filter === "unverified") return !payment.isValidated;
        return true; // "all" filter
    });

    return (
        <div className="all-payments-container">
            <div className="header-menu">
                <h1>All Payments</h1>
                <div className="filter-buttons">
                    <button
                        onClick={() => setFilter("all")}
                        className={filter === "all" ? "active" : ""}
                    >
                        All Payments
                    </button>
                    <button
                        onClick={() => setFilter("verified")}
                        className={filter === "verified" ? "active" : ""}
                    >
                        Verified Payments
                    </button>
                    <button
                        onClick={() => setFilter("unverified")}
                        className={filter === "unverified" ? "active" : ""}
                    >
                        Unverified Payments
                    </button>
                </div>
            </div>
            <div className="payments-list">
                {filteredPayments.map((payment) => (
                    <div key={payment._id} className="payment-receipt">
                        <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                        <p>Sender: {payment.senderName}</p>
                        <p>Recipient: {payment.recipientName}</p>
                        <p>
                            Amount: {payment.currency} {payment.amount.toFixed(2)}
                        </p>
                        <p>Status: {payment.isValidated ? "Verified" : "Unverified"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPayments;
