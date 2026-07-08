const pool = require('../../config/db');

async function create({ examId, userId, subject, correctCount, wrongCount }) {
    const result = await pool.query(
        `INSERT INTO exam_subject_results (exam_id, subject, correct_count, wrong_count)
         SELECT $1, $2, $3, $4
         WHERE EXISTS (SELECT 1 FROM exams WHERE id = $1 AND user_id = $5)
         RETURNING *`,
        [examId, subject, correctCount, wrongCount, userId]
    );
    return result.rows[0];
}

async function findSubjectSummaryByUserId(userId) {
    const result = await pool.query(
        `SELECT esr.subject,
                SUM(esr.correct_count)::int AS correct_count,
                SUM(esr.wrong_count)::int AS wrong_count
         FROM exam_subject_results esr
         JOIN exams e ON e.id = esr.exam_id
         WHERE e.user_id = $1
         GROUP BY esr.subject`,
        [userId]
    );
    return result.rows;
}

async function findAllByExamId(examId, userId) {
    const result = await pool.query(
        `SELECT esr.*
         FROM exam_subject_results esr
         JOIN exams e ON e.id = esr.exam_id
         WHERE esr.exam_id = $1 AND e.user_id = $2
         ORDER BY esr.subject`,
        [examId, userId]
    );
    return result.rows;
}

async function findByIdAndUserId(id, userId) {
    const result = await pool.query(
        `SELECT esr.*
         FROM exam_subject_results esr
         JOIN exams e ON e.id = esr.exam_id
         WHERE esr.id = $1 AND e.user_id = $2`,
        [id, userId]
    );
    return result.rows[0];
}

async function update(id, userId, { correctCount, wrongCount }) {
    const result = await pool.query(
        `UPDATE exam_subject_results esr
         SET correct_count = $1, wrong_count = $2
         FROM exams e
         WHERE esr.id = $3 AND esr.exam_id = e.id AND e.user_id = $4
         RETURNING esr.*`,
        [correctCount, wrongCount, id, userId]
    );
    return result.rows[0];
}

async function deleteByIdAndUserId(id, userId) {
    const result = await pool.query(
        `DELETE FROM exam_subject_results esr
         USING exams e
         WHERE esr.id = $1 AND esr.exam_id = e.id AND e.user_id = $2
         RETURNING esr.id`,
        [id, userId]
    );
    return result.rows[0];
}

module.exports = {
    create,
    findSubjectSummaryByUserId,
    findAllByExamId,
    findByIdAndUserId,
    update,
    deleteByIdAndUserId,
};
