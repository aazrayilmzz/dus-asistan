const pool = require('../../config/db');

async function create({ userId, question, answer, subject, difficulty, isAiGenerated = false }) {
    const result = await pool.query(
        `INSERT INTO flashcards (user_id, question, answer, subject, difficulty, is_ai_generated)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, question, answer, subject, difficulty, isAiGenerated]
    );
    return result.rows[0];
}

async function findAllByUserId(userId, { subject, difficulty, needsReview, due, isAiGenerated } = {}) {
    const conditions = ['user_id = $1'];
    const params = [userId];

    if (subject) {
        params.push(subject);
        conditions.push(`subject = $${params.length}`);
    }

    if (difficulty) {
        params.push(difficulty);
        conditions.push(`difficulty = $${params.length}`);
    }

    if (needsReview !== undefined) {
        params.push(needsReview);
        conditions.push(`needs_review = $${params.length}`);
    }

    if (due) {
        conditions.push(`(next_review_at IS NULL OR next_review_at <= NOW())`);
    }

    if (isAiGenerated !== undefined) {
        params.push(isAiGenerated);
        conditions.push(`is_ai_generated = $${params.length}`);
    }

    const result = await pool.query(
        `SELECT * FROM flashcards WHERE ${conditions.join(' AND ')} ORDER BY subject ASC, created_at DESC`,
        params
    );
    return result.rows;
}

async function findByIdAndUserId(id, userId) {
    const result = await pool.query(
        'SELECT * FROM flashcards WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return result.rows[0];
}

async function update(id, userId, fields) {
    const allowedFields = ['question', 'answer', 'subject', 'difficulty', 'needs_review'];
    const setClauses = [];
    const params = [];

    for (const field of allowedFields) {
        if (fields[field] !== undefined) {
            params.push(fields[field]);
            setClauses.push(`${field} = $${params.length}`);
        }
    }

    params.push(id, userId);
    const result = await pool.query(
        `UPDATE flashcards
         SET ${setClauses.join(', ')}, updated_at = NOW()
         WHERE id = $${params.length - 1} AND user_id = $${params.length}
         RETURNING *`,
        params
    );
    return result.rows[0];
}

async function deleteByIdAndUserId(id, userId) {
    const result = await pool.query(
        'DELETE FROM flashcards WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
    return result.rows[0];
}

async function updateNextReview(id, userId, nextReviewAt, needsReview) {
    const setClauses = ['next_review_at = $1', 'updated_at = NOW()'];
    const params = [nextReviewAt];

    if (needsReview !== undefined) {
        params.push(needsReview);
        setClauses.push(`needs_review = $${params.length}`);
    }

    params.push(id, userId);
    const result = await pool.query(
        `UPDATE flashcards
         SET ${setClauses.join(', ')}
         WHERE id = $${params.length - 1} AND user_id = $${params.length}
         RETURNING *`,
        params
    );
    return result.rows[0];
}

module.exports = {
    create,
    findAllByUserId,
    findByIdAndUserId,
    update,
    deleteByIdAndUserId,
    updateNextReview,
};
