const examsService = require('./exams.service');

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
        res.status(400).json({ status: 'error', message: 'Geçersiz sınav id.' });
        return null;
    }
    return id;
}

async function create(req, res) {
    const { examName, examDate, correctCount, wrongCount, blankCount, score } = req.body;

    if (!examName || correctCount === undefined || wrongCount === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'examName, correctCount ve wrongCount alanları zorunludur.',
        });
    }

    try {
        const exam = await examsService.createExam(req.user.userId, {
            examName,
            examDate,
            correctCount,
            wrongCount,
            blankCount,
            score,
        });
        res.status(201).json({ status: 'success', data: exam });
    } catch (error) {
        sendError(res, error);
    }
}

async function list(req, res) {
    try {
        const exams = await examsService.getUserExams(req.user.userId);
        res.status(200).json({ status: 'success', data: exams });
    } catch (error) {
        sendError(res, error);
    }
}

async function update(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    const { examName, examDate, correctCount, wrongCount, blankCount, score } = req.body;

    try {
        const exam = await examsService.updateExam(req.user.userId, id, {
            examName,
            examDate,
            correctCount,
            wrongCount,
            blankCount,
            score,
        });
        res.status(200).json({ status: 'success', data: exam });
    } catch (error) {
        sendError(res, error);
    }
}

async function remove(req, res) {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        await examsService.deleteExam(req.user.userId, id);
        res.status(200).json({ status: 'success', message: 'Sınav kaydı silindi.' });
    } catch (error) {
        sendError(res, error);
    }
}

module.exports = {
    create,
    list,
    update,
    remove,
};
