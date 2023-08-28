const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({
        user: user.id,
        name: user.name, 
        role: user.role, 
        institution: user.institution
    }, JWT_SECRET, { expiresIn: '4h' });
}
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

const decodeToken = (token) => {
    return jwt.decode(token, { complete: true });
}
module.exports = { generateToken, verifyToken, decodeToken };