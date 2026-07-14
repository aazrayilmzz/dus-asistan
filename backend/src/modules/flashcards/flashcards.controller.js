const flashcardsService = require('./flashcards.service');

function sendError(res, error) {
    if (!error.statusCode) {
        console.error('Beklenmeyen hata:', error);
    }
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Sunucu hatası oluştu.',
    });
}

function parseId(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ status: 'error', message: 'Geçersiz kart id.' });
        return null;
    }
    return id;
}

async function create(req, res) {
    const { question, answer, subject, difficulty } = req.body;

    if (!question || !answer || !subject) {
        return res.status(400).json({
            status: 'error',
            message: 'question, answer ve subject alanları zorunludur.',
        });
    }

    try {
        const card = await flashcardsService.createFlashcard(req.user.userId, { question, answer, subject, difficulty });
        res.status(201).json({ status: 'success', data: card });
    } catch (error) {
        sendError(res, error);
    }
}

async function list(req, res) {
    const { subject, difficulty, needsReview, due } = req.query;

    try {
        const cards = await flashcardsService.getUserFlashcards(req.user.userId, {
            subject,
            difficulty,
            needsReview: needsReview === undefined ? undefined : needsReview === 'true',
            due: due === 'true',
        });
        res.status(200).json({ status: 'success', data: cards });
    } catch (error) {
        sendError(res, error);
    }
}

async function update(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    const { question, answer, subject, difficulty, needsReview } = req.body;

    try {
        const card = await flashcardsService.updateFlashcard(req.user.userId, id, {
            question,
            answer,
            subject,
            difficulty,
            needsReview,
        });
        res.status(200).json({ status: 'success', data: card });
    } catch (error) {
        sendError(res, error);
    }
}

async function remove(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        await flashcardsService.deleteFlashcard(req.user.userId, id);
        res.status(200).json({ status: 'success', message: 'Kart silindi.' });
    } catch (error) {
        sendError(res, error);
    }
}

async function review(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    const { rating } = req.body;

    if (!rating) {
        return res.status(400).json({
            status: 'error',
            message: 'rating alanı zorunludur.',
        });
    }

    try {
        const card = await flashcardsService.reviewFlashcard(req.user.userId, id, rating);
        res.status(200).json({ status: 'success', data: card });
    } catch (error) {
        sendError(res, error);
    }
}

async function generate(req, res) {
    const { subject, count } = req.body;

    if (!subject) {
        return res.status(400).json({
            status: 'error',
            message: 'subject alanı zorunludur.',
        });
    }

    try {
        const cards = await flashcardsService.generateFlashcards(req.user.userId, { subject, count });
        res.status(201).json({ status: 'success', data: cards });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    create,
    list,
    update,
    remove,
    review,
    generate,
};
