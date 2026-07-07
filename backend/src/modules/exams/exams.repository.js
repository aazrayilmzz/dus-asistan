const pool = require('../../config/db');

async function create({ userId, examName, examDate, correctCount, wrongCount, blankCount, net, score }) {
    const result = await pool.query(
        `INSERT INTO exams (user_id, exam_name, exam_date, correct_count, wrong_count, blank_count, net, score)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, examName, examDate, correctCount, wrongCount, blankCount, net, score]
    );
    return result.rows[0];
}

async function findAllByUserId(userId) {
    const result = await pool.query(
        'SELECT * FROM exams WHERE user_id = $1 ORDER BY exam_date DESC, created_at DESC',
        [userId]
    );
    return result.rows;
}

async function findByIdAndUserId(id, userId) {
    const result = await pool.query(
        'SELECT * FROM exams WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return result.rows[0];
}

const FIELD_TO_COLUMN = {
    examName: 'exam_name',
    examDate: 'exam_date',
    correctCount: 'correct_count',
    wrongCount: 'wrong_count',
    blankCount: 'blank_count',
    net: 'net',
    score: 'score',
};

async function update(id, userId, fields) {
    const setClauses = [];
    const params = [];

    for (const [key, column] of Object.entries(FIELD_TO_COLUMN)) {
        if (fields[key] !== undefined) {
            params.push(fields[key]);
            setClauses.push(`${column} = $${params.length}`);
        }
    }

    params.push(id, userId);
    const result = await pool.query(
        `UPDATE exams
         SET ${setClauses.join(', ')}, updated_at = NOW()
         WHERE id = $${params.length - 1} AND user_id = $${params.length}
         RETURNING *`,
        params
    );
    return result.rows[0];
}

async function deleteByIdAndUserId(id, userId) {
    const result = await pool.query(
        'DELETE FROM exams WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
    return result.rows[0];
}

module.exports = {
    create,
    findAllByUserId,
    findByIdAndUserId,
    update,
    deleteByIdAndUserId,
};
