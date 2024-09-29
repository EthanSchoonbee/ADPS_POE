import express from 'express';
import connectToDatabase from '../db/conn.mjs';
import { ObjectId } from "mongodb"; 
import chalk from "chalk";

const router = express.Router();

// middleware for async error handling (catch errors and pass to errorHandler)
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//test route
router.get("/", asyncHandler(async (req, res) => {
    res.send("this is a test route 1");
}));

// export router instance
export default router;