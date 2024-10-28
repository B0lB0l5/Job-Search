import jwt from 'jsonwebtoken';

export const generateToken = ({ payload, secretKey = process.env.JWT_SECRET }) => {
    return jwt.sign(payload, secretKey)
}

export const verifyToken = ({ token, secretKey = process.env.JWT_SECRET }) => {
    try { 
        return jwt.verify(token, secretKey) 
    } catch (error) {
        console.log(error);
    }
}