const pomodoroService = require('./pomodoro.service');

function sendError(res, error) {
    if (!error.statusCode) {
        console.error('Beklenmeyen hata:', error);
    }
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Sunucu hatası oluştu.',
    });
}

function parseId(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ status: 'error', message: 'Geçersiz oturum id.' });
        return null;
    }
    return id;
}

async function start(req, res) {
    const { subject, detail, durationMinutes } = req.body;

    try {
        const session = await pomodoroService.startSession(req.user.userId, { subject, detail, durationMinutes });
        res.status(201).json({ status: 'success', data: session });
    } catch (error) {
        sendError(res, error);
    }
}

async function complete(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        const session = await pomodoroService.completeSession(req.user.userId, id);
        res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        sendError(res, error);
    }
}

async function abandon(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        const session = await pomodoroService.abandonSession(req.user.userId, id);
        res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        sendError(res, error);
    }
}

async function active(req, res) {
    try {
        const session = await pomodoroService.getActiveSession(req.user.userId);
        res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        sendError(res, error);
    }
}

async function history(req, res) {
    try {
        const sessions = await pomodoroService.getHistory(req.user.userId);
        res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
        sendError(res, error);
    }
}

async function streak(req, res) {
    try {
        const result = await pomodoroService.getStreak(req.user.userId);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

async function weeklySummary(req, res) {
    try {
        const result = await pomodoroService.getWeeklySummary(req.user.userId);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    start,
    complete,
    abandon,
    active,
    history,
    streak,
    weeklySummary,
};
