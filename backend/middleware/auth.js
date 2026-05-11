import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'locallink_secret_key';

/**
 * Verifies the Bearer JWT token on protected routes.
 * Attaches decoded { id, role } to req.user on success.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

/**
 * Restricts access to users with the 'seller' role.
 * Must be used after verifyToken.
 */
export const requireSeller = (req, res, next) => {
  if (req.user?.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Seller account required.' });
  }
  next();
};
