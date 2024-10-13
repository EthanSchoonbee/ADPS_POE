import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.mjs";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";
import ExpressBrute from "express-brute";
import { auth } from "../middleware/authMiddleware.mjs"; // Make sure this import is present
import mongoose from "mongoose";
// Add this import
import securityMiddleware from "../middleware/securityMiddleware.mjs";
import employee from "../models/Employee.mjs";

// create an instance of the express router
const router = express.Router();

// EXPRESS BRUTE bruteforce prevention (input rate limiting)
const store = new ExpressBrute.MemoryStore();
// free 5 retries then a lockout for 1 hour. During the lockout you get 1 retry before a timer is set.
const bruteforce = new ExpressBrute(store, {
    // Define the rate limit: here it's set to 5 requests per minute
    freeRetries: 5, // allowed tries before lockout
    minWait: 5000, // 5 seconds min wait time
    maxWait: 60000, // 1 minute max wait time
    lifetime: 60 * 60, // 1 hour lockout lifetime
});

// regular expression for South African ID validation
const idNumberRegex =
    /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(0[0-9]|[0-9][0-9])([0-4][0-9]{3}|[5-9][0-9]{3})([01])8[0-9]$/;

// regular expression for bank account number validation
const accountNumberPattern = /^\d{7,10}$/;

// regular expression for password validation on signup
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// user registration input validation schema
const signupSchema = z.object({
    firstname: z.string().min(1, { message: "Firstname is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().email({ message: "Invalid email address" }), // First in order
    username: z.string().min(1, { message: "Username is required" }),
    idNumber: z
        .string() // Move idNumber before accountNumber
        .min(1, { message: "ID number is required" })
        .refine((id) => idNumberRegex.test(id), {
            message: "Invalid ID number format",
        }),
    accountNumber: z
        .string()
        .min(1, { message: "Account number is required" })
        .refine((accountNumber) => accountNumberPattern.test(accountNumber), {
            message: "Invalid Account number. It should be between 7 to 10 digits.",
        }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .refine((password) => passwordRegex.test(password), {
            message:
                "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.",
        }),
    confirmPassword: z.string(),
});

// user and employee login input validation schema
const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Username or account number is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

// middleware for async error handling (catch errors and pass to errorHandler)
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// use the connectDbMiddleware for all routes in this router
router.use(connectDbMiddleware);

// Apply security middleware to all routes in this router
console.log('Applying security middleware to auth routes...');
router.use(securityMiddleware);
console.log('Security middleware applied to auth routes.');

console.log("Loaded Route : auth");
// ENDPOINTS:
// 1. Register : user account registration (no auth required)
router.post(
    "/signup",
    asyncHandler(async (req, res) => {
        console.log("Received signup request:", req.body);

        // validate input data against the signup schema
        const validationResult = signupSchema.safeParse(req.body);

        // Initialize counters and arrays for handling errors
        let missingFields = [];
        let formatErrors = [];

        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors;

            // categories errors
            errorMessages.forEach((error) => {
                if (error.message.includes("is required")) {
                    missingFields.push(error.message);
                } else {
                    formatErrors.push(error.message);
                }
            });

            if (missingFields.length > 0) {
                return res.status(400).json({
                    error: "Fill in all inputs",
                });
            }

            if (formatErrors.length > 0) {
                return res.status(400).json({
                    error: formatErrors[0],
                });
            }
        }

        // pass valid data to local variables
        const {
            firstname,
            lastname,
            email,
            username,
            password,
            confirmPassword,
            accountNumber,
            idNumber,
        } = validationResult.data;

        // check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match",
            });
        }

        // get users collections reference
        const collection = req.db.collection("users");

        // Check if the user already exists by email, username, ID number, or account number
        const existingUser = await collection.findOne({
            $or: [{ email }, { username }, { idNumber }, { accountNumber }],
        });

        // error out if usr credential exist already
        if (existingUser) {
            const errorFields = [];

            // Check for each specific field
            if (existingUser.username === username) {
                errorFields.push("this username");
            }
            if (existingUser.email === email) {
                errorFields.push("this email");
            }
            if (existingUser.idNumber === idNumber) {
                errorFields.push("this ID number");
            }
            if (existingUser.accountNumber === accountNumber) {
                errorFields.push("this account number");
            }

            // Only proceed to create the error message if there are fields to report
            if (errorFields.length > 0) {
                // Construct the error message based on the collected fields
                let errorMessage =
                    "A user with " +
                    errorFields.join(", ").replace(/, ([^,]*)$/, " and $1") +
                    " already exists.";

                return res.status(400).json({
                    error: errorMessage,
                });
            }
        }

        // salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user instance
        const newUser = new User({
            firstname,
            lastname,
            email,
            username,
            password: hashedPassword,
            accountNumber,
            idNumber,
            role: "user",
        });

        // save the user to the database
        await collection.insertOne(newUser);

        // create a token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1h" }
        );

        // send a response
        res.status(201).json({
            message: "User registered successfully",
            token,
        });

        console.log("SIGNUP SUCCESSFUL");
    })
);

// 2. Login : facilitate user account login (no auth required)
router.post(
    "/login",
    bruteforce.prevent,
    asyncHandler(async (req, res) => {
        console.log("Received login request:", req.body);

        // validate input data against the login schema
        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Please fill out all fields",
                details: validationResult.error.errors,
            });
        }

        // pass valid data to local variables
        const { identifier, password } = validationResult.data;

        //get users collection reference
        let collection = req.db.collection("users");

        // check in users collection for account presence
        let user = await collection.findOne({
            $or: [{ username: identifier }, { accountNumber: identifier }],
        });

        // check if the user was found
        if (!user) {
            collection = req.db.collection("employees");
            // if user not found, check in employees collection
            user = await collection.findOne({
                username: identifier, // Assuming employees also have a username
            });
        }

        // if no user or employee found
        if (!user) {
            return res.status(401).json({
                error: "Invalid username or account number",
            });
        }

        // compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid password",
            });
        }

        // create a token
        const token = jwt.sign(
            { id: user._id, role: user.role || "user" },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1h" }
        );

        // send a response with user role
        res.status(200).json({
            message: "Login successful",
            token,
        });

        console.log("LOGIN SUCCESSFUL");
    })
);

//Route that is getting the current user information
router.get(
    "/user",
    auth,
    asyncHandler(async (req, res) => {
        //fetching the user informatoin from the database for the user id in the request body
        console.log("Fetching user information for user ID:", req.user.id);

        //try catch block for handling any errors that may occur
        try {
            //fetchin the user information from the database for the user id in the request body
            const userCollection = req.db.collection("users");
            //finding the user in the database and excluding the password field
            const user = await userCollection.findOne(
                { _id: new mongoose.Types.ObjectId(req.user.id) },
                { projection: { password: 0 } }
            );

            //if the user is not empty then send the user information
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            //sending the user information to the frontend
            res.status(200).json({
                user: {
                    id: user._id, //the user id
                    firstname: user.firstname, //the user firstname
                    lastname: user.lastname, //the user lastname
                    email: user.email, //the user email
                    username: user.username, //the user username
                    accountNumber: user.accountNumber, //the user account number
                    role: user.role, //the user role
                },
            });
        } catch (error) {
            //if the user is not found then send an error message
            console.error(
                "Error fetching user information:",
                error,
                "Failed to fetch user information"
            );
            res.status(500).json({ error: "Internal server error" }); //Will send an error message to the frontend
        }
    })
);

router.get(
    "/employee",
    auth, asyncHandler(async (req, res) => {
        console.log("Fetching employee information for user ID:", req.user.id);

        try{
            const employeeCollection = req.db.collection("employees")
            //getting the employee based on the user id found in the collection
            const employee = await employeeCollection.findOne(
                { _id: new mongoose.Types.ObjectId(req.user.id) },
                { projection: { password: 0 } }
            )

            //if the employee is not empty then send the user information
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            //sending the user information to the frontend
            res.status(200).json({
                employee: {
                    id: employee.id, //the employee id
                    email: employee.email, //the employee email
                    username: employee.username,//the employee username,
                    role: employee.role, //the employee role
                },
            });
        }
        catch(error){
            //if the user is not found then send an error message
            console.error(
                "Error fetching employee information:",
                error,
                "Failed to fetch employee information"
            );
            res.status(500).json({ error: "Internal server error" }); //Will send an error message to the frontend
        }
    })
);

//getting the users name and surname from the user id
router.get(
    "/user/:id",
    auth,
    asyncHandler(async (req, res) => {
        console.log("Fetching user information for user ID:", req.params.id);

        try {
            //getting the user collection reference
            const userCollection = req.db.collection("users");
            //finding the user in the database and excluding the password field
            const user = await userCollection.findOne(
                { _id: new mongoose.Types.ObjectId(req.params.id) },
                { projection: { firstname: 1, lastname: 1 } }
            );

            //if there is no user found then send an error message
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            //sending the user information to the frontend
            res.status(200).json({
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
            });
        } catch (error) {
            //if there is an error. log the error
            console.error(
                "Error fetching user information:",
                error,
                "Failed to fetch user information"
            );
            res.status(500).json({ error: "Internal server error" });
        }
    })
);

export default router;
