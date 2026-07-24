const examsRepository = require('./exams.repository');
const statsService = require('../stats/stats.service');

function calculateNet(correctCount, wrongCount) {
    const net = correctCount - wrongCount / 4;
    return Math.round(net * 100) / 100;
}

function validateNonNegative(label, value) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        const error = new Error(`${label} negatif olmayan bir sayı olmalıdır.`);
        error.statusCode = 400;
        throw error;
    }
}

async function createExam(userId, { examName, examDate, correctCount, wrongCount, blankCount, score }) {
    validateNonNegative('correctCount', correctCount);
    validateNonNegative('wrongCount', wrongCount);
    validateNonNegative('blankCount', blankCount);

    const net = calculateNet(correctCount, wrongCount);

    const created = await examsRepository.create({
        userId,
        examName,
        examDate: examDate || new Date().toISOString().slice(0, 10),
        correctCount,
        wrongCount,
        blankCount: blankCount ?? 0,
        net,
        score,
    });

    await statsService.recordActivity(userId);

    return created;
}

async function getUserExams(userId) {
    return examsRepository.findAllByUserId(userId);
}

async function updateExam(userId, examId, { examName, examDate, correctCount, wrongCount, blankCount, score }) {
    if ([examName, examDate, correctCount, wrongCount, blankCount, score].every((value) => value === undefined)) {
        const error = new Error('Güncellemek için en az bir alan gönderilmelidir.');
        error.statusCode = 400;
        throw error;
    }

    validateNonNegative('correctCount', correctCount);
    validateNonNegative('wrongCount', wrongCount);
    validateNonNegative('blankCount', blankCount);

    const existing = await examsRepository.findByIdAndUserId(examId, userId);
    if (!existing) {
        const error = new Error('Sınav kaydı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    let net;
    if (correctCount !== undefined || wrongCount !== undefined) {
        const finalCorrect = correctCount !== undefined ? correctCount : existing.correct_count;
        const finalWrong = wrongCount !== undefined ? wrongCount : existing.wrong_count;
        net = calculateNet(finalCorrect, finalWrong);
    }

    const updated = await examsRepository.update(examId, userId, {
        examName,
        examDate,
        correctCount,
        wrongCount,
        blankCount,
        score,
        net,
    });

    return updated;
}

async function deleteExam(userId, examId) {
    const deleted = await examsRepository.deleteByIdAndUserId(examId, userId);
    if (!deleted) {
        const error = new Error('Sınav kaydı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
}

module.exports = {
    createExam,
    getUserExams,
    updateExam,
    deleteExam,
};
