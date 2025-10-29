import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";

/**
 * Protect routes with JWT authentication
 * @returns Middleware function
 */
export const protect = asyncHandler(async (req, res, next) => {
  //console.log('Headers:', req.headers); // Debug log
  
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
   // console.log('Extracted token:', token); // Debug log
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log('Decoded token:', decoded); // Debug log
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        //console.log('User not found for ID:', decoded.id); // Debug log
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      //console.log('Authentication successful for user:', req.user.email); // Debug log
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message); // More detailed error
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  if (!token) {
    //console.log('No token provided in headers'); // Debug log
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }
});