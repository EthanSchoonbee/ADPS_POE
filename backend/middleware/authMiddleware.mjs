import jwt from 'jsonwebtoken'
import chalk from 'chalk'

// middleware to authenticate the user and verify the JWT token
export const auth = (req, res, next) => {
    const token = req.headers('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorisation denied' });
    }

    try {

        // verify token & attach the user information (decoded token) to the request body
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        next(); // move to next middleware/route handler
    } catch(error) {
        console.error(chalk.red("Invalid token:", error));
        return res.status(401).send({ message: 'Unauthorised', error: error.message });
    }
}

// middleware to check if the users is one of the allowed roles
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // ensurer that the user has been authenticated first (token is decoded)
        if (!req.user) {
            return res.status(403).json({ message: 'Access denied. No user information available.' });
        }

        // check if the user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have the required permissions' });
        }

        // if the user roe is allowed, proceed
        next();
    }
}