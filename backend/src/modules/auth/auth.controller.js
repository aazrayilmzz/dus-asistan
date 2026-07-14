const authService = require('./auth.service');

function sendError(res, error) {
    if (!error.statusCode) {
        console.error('Beklenmeyen hata:', error);
    }
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Sunucu hatası oluştu.',
    });
}

async function register(req, res) {
    const { email, password, fullName, targetSpecialty, targetScore, targetExamDate } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({
            status: 'error',
            message: 'email, password ve fullName alanları zorunludur.',
        });
    }

    try {
        const user = await authService.registerUser({ email, password, fullName, targetSpecialty, targetScore, targetExamDate });
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        sendError(res, error);
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'email ve password alanları zorunludur.',
        });
    }

    try {
        const result = await authService.loginUser({ email, password });
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

async function me(req, res) {
    try {
        const user = await authService.getUserProfile(req.user.userId);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        sendError(res, error);
    }
}

async function updateProfile(req, res) {
    const { targetExamDate } = req.body;

    if (targetExamDate !== undefined && targetExamDate !== null && Number.isNaN(Date.parse(targetExamDate))) {
        return res.status(400).json({
            status: 'error',
            message: 'targetExamDate geçerli bir tarih olmalıdır.',
        });
    }

    try {
        const user = await authService.updateTargetExamDate(req.user.userId, targetExamDate);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    register,
    login,
    me,
    updateProfile,
};
