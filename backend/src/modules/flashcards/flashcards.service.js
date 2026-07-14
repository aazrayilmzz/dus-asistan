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

async function getUserFlashcards(userId, { subject, difficulty, needsReview, due } = {}) {
    return flashcardsRepository.findAllByUserId(userId, { subject, difficulty, needsReview, due });
}

async function updateFlashcard(userId, cardId, { question, answer, subject, difficulty, needsReview }) {
    if (
        question === undefined &&
        answer === undefined &&
        subject === undefined &&
        difficulty === undefined &&
        needsReview === undefined
    ) {
        const error = new Error('Güncellemek için en az bir alan gönderilmelidir.');
        error.statusCode = 400;
        throw error;
    }

    assertValidDifficulty(difficulty);

    const updated = await flashcardsRepository.update(cardId, userId, {
        question,
        answer,
        subject,
        difficulty,
        needs_review: needsReview,
    });
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

const REVIEW_INTERVAL_MS = {
    zor: 10 * 60 * 1000,
    orta: 24 * 60 * 60 * 1000,
    kolay: 3 * 24 * 60 * 60 * 1000,
};

function assertValidRating(rating) {
    if (!REVIEW_INTERVAL_MS[rating]) {
        const error = new Error(`rating şu değerlerden biri olmalı: ${Object.keys(REVIEW_INTERVAL_MS).join(', ')}`);
        error.statusCode = 400;
        throw error;
    }
}

async function reviewFlashcard(userId, cardId, rating) {
    assertValidRating(rating);

    const nextReviewAt = new Date(Date.now() + REVIEW_INTERVAL_MS[rating]);
    const updated = await flashcardsRepository.updateNextReview(cardId, userId, nextReviewAt);
    if (!updated) {
        const error = new Error('Kart bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    return updated;
}

module.exports = {
    createFlashcard,
    getUserFlashcards,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
};
