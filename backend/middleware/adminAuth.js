const adminAuth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token (in real app, use JWT)
    const decoded = JSON.parse(token);
    
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