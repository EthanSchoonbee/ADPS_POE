import express from "express";
import { z } from "zod";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";
import Payment from "../models/Payment.mjs"; //importing the payment model
import { auth } from "../middleware/authMiddleware.mjs"; // Import the auth middleware
// Add this import
import securityMiddleware from "../middleware/securityMiddleware.mjs";

// create an instance of the express router
const router = express.Router();

// Apply security middleware to all routes in this router
console.log('Applying security middleware to transaction routes...');
router.use(securityMiddleware);
console.log('Security middleware applied to transaction routes.');

//declaration of the regex for the input validation
//this amount regex is used to validate that the amount is a number with a maximum of 2 decimal places
const amountRegex = /^(\d+(\.\d{1,2})?)$/;
//dummy account number regex. Validating the number is between 10 and 16 digits
const accountNumberRegex = /^\d{7,11}$/;

//swift codes for the different banks
const swiftCodes = {
    FNB: "FIRNZAJJ",
    ABSA: "ABSAZAJJ",
    NEDBANK: "NEDSZAJJ",
    CAPITEC: "CABLZAJJ",
    STANDARD_BANK: "SBZAZAJJ",
};

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
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// use the connectDbMiddleware for all routes in this router
router.use(connectDbMiddleware);

console.log("In route to payment");
// ENDPOINTS:
// 1. Payment : inputing payment details (no auth required)
router.post(
    "/payment",
    auth, // Add auth middleware here
    asyncHandler(async (req, res) => {
        //message saying the payment has started
        console.log("starting payment");
        //getting the values that are passed from the frontend
        console.log("Received data:", req.body);
        console.log("User:", req.user); // Log the user

        // validate the input data
        const validationResult = paymentSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.log("Validation failed:", validationResult.error.errors);
            return res.status(400).json(validationResult.error.errors);
        }

        //message validation is passed
        console.log("validation passed");

        // pass valid data to local variables
        const { amount, currency, bank, recipientAccountNo, recipientName } =
            validationResult.data;

        //logging the payment object
        console.log("input validated and variables captured");

        //get the swift code for the bank
        const swiftCode = swiftCodes[bank];

        // create a new payment instance
        const newPayment = new Payment({
            amount: parseFloat(amount),
            currency,
            provider: "SWIFT",
            swiftCode,
            recipientAccountNo,
            recipientBank: bank,
            recipientName, //the name of the recipient
            userId: req.user.id, //the user id of the current authenticated user logged in
            isValidated: false, // the payment is not validated yet
            createdAt: new Date(),
        });

        //payment model created
        console.log("created payment model : done");

        //inserting the payment into the database
        //Payment.create is a mongoose method to insert a new document into the database
        //similar to mongoClient.insertOne
        const result = await Payment.create(newPayment);

        //Logging the result of the insertion
        console.log("inserted into collection", result, " : done");

        //sends a response to the frontend
        res.status(201).send({ message: "Payment registered successfully" });
        console.log("done");
    })
);

// 2. Get user payments. Endpoint: /transaction/user-payments
router.get("/user-payments", auth, async (req, res) => {
    console.log("Fetching payments for user:", req.user.id);
    const userId = req.user.id;
    try {
        console.log(
            "Attempting to find payments for userId:",
            userId,
            "processing"
        );
        const payments = await Payment.find({ userId: userId }).sort({
            createdAt: -1,
        });

        //logging theat payments have been fetched
        console.log("Fetched payments:", payments);
        //logging the number of payments found
        console.log("Number of payments found:", payments.length);

        //sending the payments to the frontend
        res.status(200).json({ payments });
        console.log("done"); //loggging that its done
    } catch (error) {
        //logging the error.
        console.error("Error fetching payments:", error);
        res
            .status(500)
            .json({ message: "Error fetching payments", error: error.message });
    }
});

// Fetch all payments (for employee dashboard)
router.get("/all-payments", auth, async (req, res) => {
    try {
        // Check if the user is an employee
        if (req.user.role !== "employee") {
            return res.status(403).json({ message: "Access denied. Employee only." });
        }

        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching all payments:", error);
        res
            .status(500)
            .json({ message: "Error fetching payments", error: error.message });
    }
});

//user payment implemented
export default router;
