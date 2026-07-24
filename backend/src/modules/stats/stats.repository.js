const pool = require('../../config/db');

async function getStreakFields(userId) {
    const result = await pool.query(
        'SELECT current_streak, longest_streak, last_activity_date FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0];
}

async function updateStreakFields(userId, { currentStreak, longestStreak, lastActivityDate }) {
    const result = await pool.query(
        `UPDATE users
         SET current_streak = $1, longest_streak = $2, last_activity_date = $3
         WHERE id = $4
         RETURNING current_streak, longest_streak, last_activity_date`,
        [currentStreak, longestStreak, lastActivityDate, userId]
    );
    return result.rows[0];
}

async function createFlashcardReview({ userId, flashcardId, subject, rating }) {
    const result = await pool.query(
        `INSERT INTO flashcard_reviews (user_id, flashcard_id, subject, rating)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, flashcardId, subject, rating]
    );
    return result.rows[0];
}

async function getWeeklyFlashcardStats(userId, sinceDate) {
    const result = await pool.query(
        `SELECT subject, rating, COUNT(*)::int AS count
         FROM flashcard_reviews
         WHERE user_id = $1 AND reviewed_at >= $2::date
         GROUP BY subject, rating`,
        [userId, sinceDate]
    );
    return result.rows;
}

async function getWeeklyExamTotals(userId, sinceDate) {
    const result = await pool.query(
        `SELECT COALESCE(SUM(correct_count), 0)::int AS correct_count,
                COALESCE(SUM(wrong_count), 0)::int AS wrong_count
         FROM exams
         WHERE user_id = $1 AND exam_date >= $2::date`,
        [userId, sinceDate]
    );
    return result.rows[0];
}

async function getWeeklyExamSubjectStats(userId, sinceDate) {
    const result = await pool.query(
        `SELECT esr.subject,
                SUM(esr.correct_count)::int AS correct_count,
                SUM(esr.wrong_count)::int AS wrong_count
         FROM exam_subject_results esr
         JOIN exams e ON e.id = esr.exam_id
         WHERE e.user_id = $1 AND e.exam_date >= $2::date
         GROUP BY esr.subject`,
        [userId, sinceDate]
    );
    return result.rows;
}

module.exports = {
    getStreakFields,
    updateStreakFields,
    createFlashcardReview,
    getWeeklyFlashcardStats,
    getWeeklyExamTotals,
    getWeeklyExamSubjectStats,
};
