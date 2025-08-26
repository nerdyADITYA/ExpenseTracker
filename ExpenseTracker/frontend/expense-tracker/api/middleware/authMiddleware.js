const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verify access token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password -refreshToken');
            
            if (!req.user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Not authorized, user not found' 
                });
            }
            
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Access token expired',
                    code: 'TOKEN_EXPIRED'
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid access token',
                    code: 'INVALID_TOKEN'
                });
            } else {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token verification failed',
                    code: 'TOKEN_FAILED'
                });
            }
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access token required',
            code: 'NO_TOKEN'
        });
    }
};