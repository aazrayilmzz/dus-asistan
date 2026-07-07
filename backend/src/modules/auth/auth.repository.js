const pool = require('../../config/db');

async function findByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

async function createUser({ email, passwordHash, fullName, targetSpecialty = null, targetScore = null }) {
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, target_specialty, target_score)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name, target_specialty, target_score, created_at`,
        [email, passwordHash, fullName, targetSpecialty, targetScore]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        'SELECT id, email, full_name, target_specialty, target_score, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

module.exports = {
    findByEmail,
    createUser,
    findById,
};
