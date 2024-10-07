import jwt from 'jsonwebtoken'

// middleware to authenticate the user and verify the JWT token
export const auth = (req, res, next) => {
    // get token from the Authorization header (Bearer <token>)
    const token = req.headers.authorization?.split(' ')[1];

    // check is a JWT exists
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorisation denied' });
    }

    try {
        // verify token & attach the user information (decoded token) to the request body
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        next(); // move to next middleware/route handler
    } catch(error) {
        //log token error
        console.error("Invalid token:", error);

        // check if token error was expiry
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }

        // return other errors with token
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