import Payment from "../models/Payment.mjs";
import Receiver from "../models/Receiver.mjs";
import express from 'express';
import {z} from "zod";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";

// create an instance of the express router
const router = express.Router();

// initial payment input validation schema
const paymentSchema = z.object({
    amount: z.string().min(1, { message: "amount is required" }),
    currency: z.string().min(1, { message: "currency is required" }),
    provider: z.string().min(1, { message: "provider is required" }),
});

// initial receiver input validation schema
const receiverSchema = z.object({
    swiftCode: z.string().min(1, { message: "swiftCode is required" }),
    recipientAccountNo: z.string().min(1, { message: "recipientAccountNo is required" }),
    recipientBank: z.string().min(1, { message: "recipientBank is required" }),
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
    const { amount,
        currency,
        provider } = validationResult.data;

    console.log("input validated and variables captured");

    // create a new payment instance
    const newPayment = new Payment({
        amount,
        currency,
        provider
    });

    console.log("created payment model");

    // save the payment to the database
    //await collection.insertOne(newPayment);

    //console.log("inserted ");

    // send a response
    res.status(201).send({ message: "Payment registered successfully"});
}));


// ENDPOINTS:
// 2. Receiver : inputing receiver details (no auth required)
router.post('/receiver', asyncHandler(async (req, res) => {
    // validate input data against the payment schema
    const validationResult = receiverSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).send(validationResult.error.errors);
    }

    // pass valid data to local variables
    const { swiftCode,
            recipientAccountNo,
            recipientBank,
            recipientName} = validationResult.data;

    console.log("input validated and variables captured");

    // create a new payment instance
    const newReceiver = new Receiver({
        swiftCode,
        recipientAccountNo,
        recipientBank,
        recipientName
    });

    console.log("created receiver model");

    // save the receiver to the database
    //await collection.insertOne(newReceiver);

    //console.log("inserted ");

    // send a response
    res.status(201).send({ message: "Receiver registered successfully"});
}));

//user payment implemented
export default router;