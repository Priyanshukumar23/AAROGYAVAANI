const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'medikiosk_dev_secret_change_me';

function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '12h' });
}
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const decoded = jwt.verify(token, SECRET);
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden for role ' + decoded.role });
      }
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
module.exports = { sign, auth, SECRET };
