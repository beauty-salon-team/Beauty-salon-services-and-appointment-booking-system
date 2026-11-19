const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'برای دسترسی ابتدا وارد حساب کاربری شوید.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'توکن نامعتبر یا منقضی شده است.'
      });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;