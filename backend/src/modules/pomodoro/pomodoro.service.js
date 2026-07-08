const pomodoroRepository = require('./pomodoro.repository');

const ACTIVE_SESSION_CONSTRAINT = 'idx_pomodoro_sessions_one_active_per_user';
const DEFAULT_DURATION_MINUTES = 25;

function validatePositive(label, value) {
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) {
        const error = new Error(`${label} pozitif bir sayı olmalıdır.`);
        error.statusCode = 400;
        throw error;
    }
}

async function startSession(userId, { subject, durationMinutes } = {}) {
    validatePositive('durationMinutes', durationMinutes);

    try {
        return await pomodoroRepository.startSession({
            userId,
            subject,
            durationMinutes: durationMinutes ?? DEFAULT_DURATION_MINUTES,
        });
    } catch (error) {
        if (error.code === '23505' && error.constraint === ACTIVE_SESSION_CONSTRAINT) {
            const conflictError = new Error('Zaten devam eden bir pomodoro oturumun var.');
            conflictError.statusCode = 409;
            throw conflictError;
        }
        throw error;
    }
}

async function completeSession(userId, sessionId) {
    const session = await pomodoroRepository.completeSession(sessionId, userId);
    if (!session) {
        const error = new Error('Devam eden bir pomodoro oturumu bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
    return session;
}

async function abandonSession(userId, sessionId) {
    const session = await pomodoroRepository.abandonSession(sessionId, userId);
    if (!session) {
        const error = new Error('Devam eden bir pomodoro oturumu bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
    return session;
}

async function getActiveSession(userId) {
    const session = await pomodoroRepository.getActiveSession(userId);
    return session ?? null;
}

async function getHistory(userId) {
    return pomodoroRepository.getHistory(userId);
}

module.exports = {
    startSession,
    completeSession,
    abandonSession,
    getActiveSession,
    getHistory,
};
