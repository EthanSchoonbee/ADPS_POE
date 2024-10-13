import React from "react";

const UnverifiedPayments = ({ payments, onSelectPayment }) => {
    // Filter out the payments that have not been validated
    const unverifiedPayments = payments.filter((payment) => !payment.isValidated);

    // Will display the unverified payments in a list
    return (
        <div>
            {/*Heading of unverified payments*/}
            <h1>Unverified Payments</h1>
            {/*the payments list*/}
            <div className="payments-list">
                {/*mapping the unverified payments of type payment*/}
                {unverifiedPayments.map((payment) => (
                    /*displaying all of the payments in a scrollable list. getting the specific payment id*/
                    <div key={payment._id} className="payment-receipt">
                        {/*The sender name */}
                        <p>Sender: {payment.senderName}</p>
                        {/*The recipient name*/}
                        <p>Recipient: {payment.recipientName}</p>
                        {/*The date the payment was made*/}
                        <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                        {/*The amount and currency of the payment*/}
                        <p>
                            Amount: {payment.currency} {payment.amount.toFixed(2)}
                        </p>
                        {/*The button for verifying the payment*/}
                        <button onClick={() => onSelectPayment(payment)}>Verify</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UnverifiedPayments;
