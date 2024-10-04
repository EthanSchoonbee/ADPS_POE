import Payment from "../models/Payment.mjs";
import express from 'express';
import {z} from "zod";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";
import { auth } from "../middleware/authMiddleware.mjs";  // Import the auth middleware

// create an instance of the express router
const router = express.Router();

//declaration of the regex for the input validation
//this amount regex is used to validate that the amount is a number with a maximum of 2 decimal places
const amountRegex = /^(\d+(\.\d{1,2})?)$/;
//dummy account number regex. Validating the number is between 10 and 16 digits
const accountNumberRegex = /^\d{7,11}$/;

//swift codes for the different banks
const swiftCodes ={
    FNB: "FIRNZAJJ",
    ABSA: "ABSAZAJJ",
    NEDBANK: "NEDSZAJJ",
    CAPITEC: "CABLZAJJ",
    STANDARD_BANK: "SBZAZAJJ"
}

//updated payment schema with regex validation
const paymentSchema = z.object({
    amount: z.string().regex(amountRegex, { message: "Invalid amount format" }),
    currency: z.enum(["R", "$", "£"], { message: "Invalid currency" }),
    bank: z.enum(Object.keys(swiftCodes), { message: "Invalid bank" }),
    recipientAccountNo: z
        .string()
        .regex(accountNumberRegex, { message: "Invalid account number" }),
    recipientName: z.string().min(1, { message: "recipientName is required" }),
});

//middleware for async error handling (catch errors and pass to errorHandler)
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// use the connectDbMiddleware for all routes in this router
router.use(connectDbMiddleware);

console.log("In route to payment");
// ENDPOINTS:
// 1. Payment : inputing payment details (no auth required)
router.post('/payment',auth, asyncHandler(async (req, res) => {

    //message saying the payment has started
    console.log("starting payment");
    //getting the values that are passed from the frontend
    console.log("Received data:", req.body);

    // validate the input data
    const validationResult = paymentSchema.safeParse(req.body);
    if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.errors);
        return res.status(400).json(validationResult.error.errors);
    }

    //message validation is passed
    console.log("validation passed")

    // pass valid data to local variables
    const {
        amount,
        currency,
        bank,
        recipientAccountNo,
        recipientName
    } = validationResult.data;

    //logging the payment object
    console.log("input validated and variables captured");

    // get users collections reference
    const collection =  req.db.collection("transactions");

    //logging that the collection has been gotten
    console.log("collection got - transactions");

    //get the swift code for the bank
    const swiftCode = swiftCodes[bank];

    // create a new payment instance
    const newPayment = Payment({
        amount: parseFloat(amount),
        currency,
        provider: "SWIFT",
        swiftCode,
        recipientAccountNo,
        recipientBank: bank,
        recipientName,//the name of the recipient
        userId: req.user.id,//the user id of the current authenticated user logged in
        isValidated: false// the payment is not validated yet
    })

    console.log("created payment model");

    // save the payment to the database
    await collection.insertOne(newPayment);

    console.log("inserted into collection");

    // send a response
    res.status(201).send({ message: "Payment registered successfully"});
}));

//user payment implemented
export default router;