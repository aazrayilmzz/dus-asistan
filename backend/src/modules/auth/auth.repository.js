const pool = require('../../config/db');

async function findByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

async function createUser({ email, passwordHash, fullName, targetSpecialty = null, targetScore = null, targetExamDate = null }) {
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, target_specialty, target_score, target_exam_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, full_name, target_specialty, target_score, target_exam_date, created_at`,
        [email, passwordHash, fullName, targetSpecialty, targetScore, targetExamDate]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        'SELECT id, email, full_name, target_specialty, target_score, target_exam_date, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

async function updateTargetExamDate(userId, targetExamDate) {
    const result = await pool.query(
        `UPDATE users SET target_exam_date = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, email, full_name, target_specialty, target_score, target_exam_date, created_at`,
        [targetExamDate, userId]
    );
    return result.rows[0];
}

module.exports = {
    findByEmail,
    createUser,
    findById,
    updateTargetExamDate,
};
