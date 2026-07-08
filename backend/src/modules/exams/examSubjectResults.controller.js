const examSubjectResultsService = require('./examSubjectResults.service');

function sendError(res, error) {
    if (!error.statusCode) {
        console.error('Beklenmeyen hata:', error);
    }
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Sunucu hatası oluştu.',
    });
}

function parseExamId(req, res) {
    const id = Number(req.params.examId);
    if (!Number.isInteger(id)) {
        res.status(400).json({ status: 'error', message: 'Geçersiz sınav id.' });
        return null;
    }
    return id;
}

function parseId(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ status: 'error', message: 'Geçersiz branş sonucu id.' });
        return null;
    }
    return id;
}

async function summary(req, res) {
    try {
        const results = await examSubjectResultsService.getSubjectSummary(req.user.userId);
        res.status(200).json({ status: 'success', data: results });
    } catch (error) {
        sendError(res, error);
    }
}

async function create(req, res) {
    const examId = parseExamId(req, res);
    if (examId === null) return;

    const { subject, correctCount, wrongCount } = req.body;

    if (!subject || correctCount === undefined || wrongCount === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'subject, correctCount ve wrongCount alanları zorunludur.',
        });
    }

    try {
        const result = await examSubjectResultsService.createSubjectResult(req.user.userId, examId, {
            subject,
            correctCount,
            wrongCount,
        });
        res.status(201).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

async function list(req, res) {
    const examId = parseExamId(req, res);
    if (examId === null) return;

    try {
        const results = await examSubjectResultsService.getExamSubjectResults(req.user.userId, examId);
        res.status(200).json({ status: 'success', data: results });
    } catch (error) {
        sendError(res, error);
    }
}

async function update(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    const { correctCount, wrongCount } = req.body;

    if (correctCount === undefined || wrongCount === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'correctCount ve wrongCount alanları zorunludur.',
        });
    }

    try {
        const result = await examSubjectResultsService.updateSubjectResult(req.user.userId, id, {
            correctCount,
            wrongCount,
        });
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        sendError(res, error);
    }
}

async function remove(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        await examSubjectResultsService.deleteSubjectResult(req.user.userId, id);
        res.status(200).json({ status: 'success', message: 'Branş sonucu silindi.' });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    summary,
    create,
    list,
    update,
    remove,
};
