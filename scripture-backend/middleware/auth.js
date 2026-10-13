import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ');

  if (!token || token[0] !== 'Bearer') {
    return res.status(403).json({ success: false, message: 'No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
