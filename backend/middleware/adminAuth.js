const adminAuth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Parse the token
    const decoded = JSON.parse(token);
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuth;