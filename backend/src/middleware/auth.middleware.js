const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: "Yetkilendirme token'ı bulunamadı.",
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Token geçersiz veya süresi dolmuş.',
        });
    }
}

module.exports = authenticate;
