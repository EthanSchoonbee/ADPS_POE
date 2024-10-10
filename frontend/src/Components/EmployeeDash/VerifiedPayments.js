import React from "react";

const VerifiedPayments = ({ payments }) => {
    const verifiedPayments = payments.filter((payment) => payment.isValidated);

    // Will display the verified payments in a list
    return (
        <div>
            {/*Heading. Verified payments*/}
            <h1>Verified Payments</h1>
            {/*Payments list class*/}
            <div className="payments-list">
                {verifiedPayments.length === 0 && (
                    <p className="no-payments-message">No Verified Payments Available</p>
                )}
                {/*mapping the verified payments of type payment and displaying it in a list format*/}
                {verifiedPayments.map((payment) => (
                    //Displaying the payment details in a div of payment-receipt class
                    <div key={payment._id} className="payment-receipt">
                        <p>Sender: {payment.senderName}</p>{/*The senders name*/}
                        <p>Recipient: {payment.recipientName}</p>{/*The recipients name*/}
                        <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>{/*The date to a string format*/}
                        {/*The amount and currency of the payment*/}
                        <p>
                            Amount: {payment.currency} {payment.amount.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default VerifiedPayments;
