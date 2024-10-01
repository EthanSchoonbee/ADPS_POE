import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from "../models/User.mjs";
import connectDbMiddleware from "../middleware/connectDbMiddleware.mjs";

// create an instance of the express router
const router = express.Router();

// user registration input validation schema
const signupSchema = z.object({
    firstname: z.string().min(1, { message: "Firstname is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
    accountNumber: z.string().min(1, { message: "Account number is required" }),
    idNumber: z.string().min(1, { message: "ID number is required" }),
});

// user/employee login input validation schema
const loginSchema = z.object({
    identifier: z.string().min(1, { message: "Username or account number is required" }),
    password: z.string().min(6, { message: "Password is required" }),
});

// middleware for async error handling (catch errors and pass to errorHandler)
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// use the connectDbMiddleware for all routes in this router
router.use(connectDbMiddleware);

// ENDPOINTS:
// 1. Register : user account registration (no auth required)
router.post('/signup', asyncHandler(async (req, res) => {
    // validate input data against the signup schema
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).send(validationResult.error.errors);
    }

    // pass valid data to local variables
    const { firstname,
            lastname,
            email,
            username,
            password,
            confirmPassword,
            accountNumber,
            idNumber } = validationResult.data;

    // check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // get users collections reference
    const collection =  req.db.collection("users");

    // check if the user already exists by email or username
    const existingUser = await collection.findOne({
        $or: [{ email: email }, { username }]
    }); // access the users collection

    // error out if usr credential exist already
    if (existingUser) {
        return res.status(400).send({ error: "User with this email or username already exists" });
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
        role: 'user'
    });

    // save the user to the database
    await collection.insertOne(newUser);

    // create a token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // send a response
    res.status(201).send({ message: "User registered successfully", token });
}));

// 2. Login : facilitate user account login (no auth required)
router.post('/login', asyncHandler(async (req, res) => {
    // validate input data against the login schema
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).send(validationResult.error.errors);
    }

    // pass valid data to local variables
    const { identifier, password } = validationResult.data;

    //get users collection reference
    let collection = req.db.collection('users');
    // check in users collection for account presence
    let user = await collection.findOne({
        $or: [ { username: identifier },
            { accountNumber: identifier },],
    });

    // check if the user was found
    if (!user) {
        collection = req.db.collection('employees');
        // if user not found, check in employees collection
        user = await collection.findOne({
            username: identifier, // Assuming employees also have a username
        });
    }

    // if no user or employee found
    if (!user) {
        return res.status(401).send({ error: "Invalid username or account number" });
    }

    // compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({ error: "Invalid password" });
    }

    // create a token
    const token = jwt.sign({ id: user._id, role: user.role || 'user' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // send a response with user role
    res.status(200).send({ message: "Login successful", token, role: user.role || 'user' });
}));

export default router;