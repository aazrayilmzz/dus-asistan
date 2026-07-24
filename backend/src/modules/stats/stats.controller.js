const statsService = require('./stats.service');

function sendError(res, error) {
    if (!error.statusCode) {
        console.error('Beklenmeyen hata:', error);
    }
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Sunucu hatası oluştu.',
    });
}

async function streak(req, res) {
    try {
        const result = await statsService.getStreak(req.user.userId);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

async function weeklySummary(req, res) {
    try {
        const result = await statsService.getWeeklySummary(req.user.userId);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    streak,
    weeklySummary,
};
