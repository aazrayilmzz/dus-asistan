const flashcardsRepository = require('./flashcards.repository');

const ALLOWED_DIFFICULTIES = ['kolay', 'orta', 'zor'];

function assertValidDifficulty(difficulty) {
    if (difficulty !== undefined && !ALLOWED_DIFFICULTIES.includes(difficulty)) {
        const error = new Error(`difficulty şu değerlerden biri olmalı: ${ALLOWED_DIFFICULTIES.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }
}

async function createFlashcard(userId, { question, answer, subject, difficulty }) {
    assertValidDifficulty(difficulty);

    return flashcardsRepository.create({
        userId,
        question,
        answer,
        subject,
        difficulty: difficulty || 'orta',
    });
}

async function getUserFlashcards(userId, { subject, difficulty } = {}) {
    return flashcardsRepository.findAllByUserId(userId, { subject, difficulty });
}

async function updateFlashcard(userId, cardId, { question, answer, subject, difficulty }) {
    if (question === undefined && answer === undefined && subject === undefined && difficulty === undefined) {
        const error = new Error('Güncellemek için en az bir alan gönderilmelidir.');
        error.statusCode = 400;
        throw error;
    }

    assertValidDifficulty(difficulty);

    const updated = await flashcardsRepository.update(cardId, userId, { question, answer, subject, difficulty });
    if (!updated) {
        const error = new Error('Kart bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    return updated;
}

async function deleteFlashcard(userId, cardId) {
    const deleted = await flashcardsRepository.deleteByIdAndUserId(cardId, userId);
    if (!deleted) {
        const error = new Error('Kart bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
}

module.exports = {
    createFlashcard,
    getUserFlashcards,
    updateFlashcard,
    deleteFlashcard,
};
