const pool = require('../../config/db');

async function startSession({ userId, subject, detail, durationMinutes }) {
    const result = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, subject, detail, duration_minutes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, subject, detail, durationMinutes]
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

async function getCompletedSessionDays(userId) {
    const result = await pool.query(
        `SELECT DISTINCT to_char(started_at, 'YYYY-MM-DD') AS day
         FROM pomodoro_sessions
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY day DESC`,
        [userId]
    );
    return result.rows.map((row) => row.day);
}

async function getWeeklySummary(userId, weekStart, weekEnd) {
    const result = await pool.query(
        `SELECT subject, SUM(duration_minutes)::int AS total_minutes
         FROM pomodoro_sessions
         WHERE user_id = $1 AND status = 'completed' AND started_at >= $2 AND started_at < $3
         GROUP BY subject
         ORDER BY total_minutes DESC`,
        [userId, weekStart, weekEnd]
    );
    return result.rows;
}

module.exports = {
    startSession,
    completeSession,
    abandonSession,
    getActiveSession,
    getHistory,
    getCompletedSessionDays,
    getWeeklySummary,
};
