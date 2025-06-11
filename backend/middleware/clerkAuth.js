import { clerkClient } from '@clerk/backend';

export const requireClerkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const payload = await clerkClient.verifyToken(token);
    
    if (!payload.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Get or create user in your database
    const user = await User.findOne({ clerkUserId: payload.sub });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.clerkUserId = payload.sub;
    next();
  } catch (error) {
    console.error('Clerk auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};