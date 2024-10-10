import React, { useState } from "react";
import axios from "axios";
import "./VerifyPayment.css";

//The verify payment component page
const VerifyPayment = ({ payment, onBack, onVerificationComplete }) => {
    //Declaring the fields.

    //Will be used to store the fields that have been verified and will also set the verified fields
    //will be used to verify the name, the currency the bank, the swift code and the account number.
    const [verifiedFields, setVerifiedFields] = useState({});
    const [error, setError] = useState(null);//Will be used to store the error message

    //Function to handle the verification of the fields
    const handleVerifyField = (field) => {
        //using the previous state of the verified fields to set the new state of the verified fields.
        //so if the field is already verified, it will be set to false and vice versa.
        //uses a functional update pattern to update the state based on the previous state asynchronously.
        setVerifiedFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    //all fields verified function
    const allFieldsVerified = () => {
        //the required fields needed for the payment to be submitted
        const requiredFields = [
            "recipientName",//the recipient name
            "recipientAccountNo",//the recipient account number
            "recipientBank",//the recipient bank
            "amount",//the amount
            "currency",//the currency
            "swiftCode",//the swift code
        ];
        //checks if all the required fields are verifiedFields
        return requiredFields.every((field) => verifiedFields[field]);
    };

    //When the submit button is clicked
    const handleSubmit = async () => {
        //if not all fields are verified, an error message will be displayed
        if (!allFieldsVerified()) {
            setError("Please verify all fields before submitting.");
            return;
        }

        //try catch block to handle the verification of the payment
        try {
            //getting the token from the local storage
            const token = localStorage.getItem("token");
            //logging the verification being sent for the specific payment id
            console.log("Sending verification request for payment:", payment._id);
            //sending a post request to the server to verify the payment
            const response = await axios.post(
                //the url endpoint for the verification of the payment using the payment id
                `https://localhost:3001/api/transaction/verify-payment/${payment._id}`,
                {},//empty body
                //setting the headers for the request to the current token
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            //logging the response from the server using the response data
            console.log("Verification response:", response.data);
            onVerificationComplete();//will call the onVerificationComplete function
            onBack();//will call the onBack function to go to the previous page
        } catch (error) {
            //logging certain error
            console.error("Error verifying payment:", error);
            //if there is an error response
            if (error.response) {
                //logging the error response
                console.error("Error response:", error.response.data);
                //setting the error message to the error response message
                setError(
                    `Failed to verify payment: ${
                        error.response.data.message || error.response.statusText
                    }`
                );
                //if there is an error request
            } else if (error.request) {
                //logging the error request
                console.error("No response received:", error.request);
                //setting the error message to no response from server
                setError("Failed to verify payment: No response from server");
            } else {
                //logging the error details
                console.error("Error details:", error.message);
                //setting the error message to the error message
                setError(`Failed to verify payment: ${error.message}`);
            }
        }
    };

    /*Function to handle when the reject button is pressed*/
    const handleReject = () => {
        setVerifiedFields({});//will set all the verified fields to false
        setError(null);//setting the error to null
    };

    return (
        //The verify payment component
        <div className="verify-payment">
            <h2>Verify Payment</h2>
            <div className="payment-details">
                {/*Field for the recipient name*/}
                <div className="field">
                    <label>Recipient Name:</label>
                    <span>{payment.recipientName}</span>
                    <button
                        onClick={() => handleVerifyField("recipientName")}
                        className={verifiedFields.recipientName ? "verified" : ""}
                    >
                        {verifiedFields.recipientName ? "Verified" : "Verify"}
                    </button>
                </div>
                {/*Field for the account number*/}
                <div className="field">
                    <label>Recipient Account Number:</label>
                    <span>{payment.recipientAccountNo}</span>
                    {/*When the verify button is pressed*/}
                    <button
                        //on click will handle the verify field function using the recipient account number
                        onClick={() => handleVerifyField("recipientAccountNo")}
                        //if account number is verified. the button will say verified
                        className={verifiedFields.recipientAccountNo ? "verified" : ""}
                    >
                        {/*else will say verify*/}
                        {verifiedFields.recipientAccountNo ? "Verified" : "Verify"}
                    </button>
                </div>
                {/*Field for the recipient bank*/}
                <div className="field">
                    <label>Recipient Bank:</label>
                    <span>{payment.recipientBank}</span>
                    {/*When the verify button is pressed*/}
                    <button
                        //on click will handle the verify field function using the recipient bank
                        onClick={() => handleVerifyField("recipientBank")}
                        //if recipient bank is verified. the button will say verified
                        className={verifiedFields.recipientBank ? "verified" : ""}
                    >
                        {/*else will say verify*/}
                        {verifiedFields.recipientBank ? "Verified" : "Verify"}
                    </button>
                </div>
                {/*field for the amount*/}
                <div className="field">
                    <label>Amount:</label>
                    <span>{payment.amount.toFixed(2)}</span>
                    <button
                        onClick={() => handleVerifyField("amount")}
                        className={verifiedFields.amount ? "verified" : ""}
                    >
                        {verifiedFields.amount ? "Verified" : "Verify"}
                    </button>
                </div>
                {/*Field for the swift code*/}
                <div className="field">
                    <label>SWIFT Code:</label>
                    <span>{payment.swiftCode}</span>
                    <button
                        onClick={() => handleVerifyField("swiftCode")}
                        className={verifiedFields.swiftCode ? "verified" : ""}
                    >
                        {verifiedFields.swiftCode ? "Verified" : "Verify"}
                    </button>
                </div>
                {/*Field for the currency*/}
                <div className="field">
                    <label>Currency:</label>
                    <span>{payment.currency}</span>
                    <button
                        onClick={() => handleVerifyField("currency")}
                        className={verifiedFields.currency ? "verified" : ""}
                    >
                        {verifiedFields.currency ? "Verified" : "Verify"}
                    </button>
                </div>
            </div>
            {/*Will show an error message*/}
            {error && <p className="error-message">{error}</p>}
            <div className="action-buttons">
                {/*Will handle when the submit button is pressed.*/}
                {/*Will only be disabled if not all the fields are verified*/}
                <button onClick={handleSubmit} disabled={!allFieldsVerified()}>
                    Submit Verification
                </button>
                {/*Handling the reject button on click*/}
                <button onClick={handleReject}>Reject</button>
                {/*when the cancel button is pressed. Will go back to previous page*/}
                <button onClick={onBack}>Cancel</button>
            </div>
        </div>
    );
};

export default VerifyPayment;