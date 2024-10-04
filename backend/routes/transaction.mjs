import Payment from "../models/Payment.mjs";
import express from 'express';
import {z} from "zod";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";

// create an instance of the express router
const router = express.Router();

//declaration of the regex for the input validation
//this amount regex is used to validate that the amount is a number with a maximum of 2 decimal places
const amountRegex = /^(\d+(\.\d{1,2})?)$/;
//dummy account number regex. Validating the number is between 10 and 16 digits
const accountNumberRegex = /^\d{10,16}$/;

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
    currency: z.enum(["ZAR", "USD", "GBP"], { message: "Invalid currency" }),
    bank: z.enum(Object.keys(swiftCodes), { message: "Invalid bank" }),
    recipientAccountNo: z
        .string()
        .regex(accountNumberRegex, { message: "Invalid account number" }),
    recipientName: z.string().min(1, { message: "recipientName is required" }),
});

// middleware for async error handling (catch errors and pass to errorHandler)
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// use the connectDbMiddleware for all routes in this router
router.use(connectDbMiddleware);

console.log("in route payment");
// ENDPOINTS:
// 1. Payment : inputing payment details (no auth required)
router.post('/payment', asyncHandler(async (req, res) => {
    // validate input data against the payment schema
    const validationResult = paymentSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).send(validationResult.error.errors);
    }

    // pass valid data to local variables
    const {
        amount,
        currency,
        bank,
        recipientAccountNo,
        recipientName,
    } = validationResult.data;

    //logging the payment object
    console.log("input validated and variables captured");

    // get users collections reference
    const collection =  req.db.collection("transactions");

    console.log("collection got - transactions");

    const swiftCode = swiftCodes[bank];

    // create a new payment instance
    const newPayment = Payment({
        amount: parseFloat(amount),
        currency,
        provider: "SWIFT",
        swiftCode,
        recipientAccountNo,
        recipientBank: bank,
        recipientName,
        userId: "66fc505b7431a7ee1fc2d159",
        isValidated: false
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