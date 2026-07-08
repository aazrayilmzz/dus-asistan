const pool = require('../../config/db');

async function startSession({ userId, subject, durationMinutes }) {
    const result = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, subject, duration_minutes)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, subject, durationMinutes]
    );
    return result.rows[0];
}

async function completeSession(id, userId) {
    const result = await pool.query(
        `UPDATE pomodoro_sessions
         SET status = 'completed', ended_at = NOW()
         WHERE id = $1 AND user_id = $2 AND status = 'started'
         RETURNING *`,
        [id, userId]
    );
    return result.rows[0];
}

async function abandonSession(id, userId) {
    const result = await pool.query(
        `UPDATE pomodoro_sessions
         SET status = 'abandoned', ended_at = NOW()
         WHERE id = $1 AND user_id = $2 AND status = 'started'
         RETURNING *`,
        [id, userId]
    );
    return result.rows[0];
}

async function getActiveSession(userId) {
    const result = await pool.query(
        `SELECT * FROM pomodoro_sessions WHERE user_id = $1 AND status = 'started'`,
        [userId]
    );
    return result.rows[0];
}

async function getHistory(userId) {
    const result = await pool.query(
        'SELECT * FROM pomodoro_sessions WHERE user_id = $1 ORDER BY started_at DESC',
        [userId]
    );
    return result.rows;
}

module.exports = {
    startSession,
    completeSession,
    abandonSession,
    getActiveSession,
    getHistory,
};
