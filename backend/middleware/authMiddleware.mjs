import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided, authorisation denied' });

    try {

    } catch(error) {
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}