const examSubjectResultsRepository = require('./examSubjectResults.repository');
const examsRepository = require('./exams.repository');

const ALLOWED_SUBJECTS = [
    'Ağız, Diş ve Çene Cerrahisi',
    'Ağız, Diş ve Çene Radyolojisi',
    'Endodonti',
    'Ortodonti',
    'Pedodonti',
    'Periodontoloji',
    'Protetik Diş Tedavisi',
    'Restoratif Diş Tedavisi',
    'Anatomi',
    'Fizyoloji',
    'Biyokimya',
    'Histoloji-Embriyoloji',
    'Mikrobiyoloji',
    'Patoloji',
    'Farmakoloji',
];

const DUPLICATE_SUBJECT_CONSTRAINT = 'exam_subject_results_exam_id_subject_key';

function assertValidSubject(subject) {
    if (!ALLOWED_SUBJECTS.includes(subject)) {
        const error = new Error(`subject şu değerlerden biri olmalı: ${ALLOWED_SUBJECTS.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }
}

function validateNonNegative(label, value) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        const error = new Error(`${label} negatif olmayan bir sayı olmalıdır.`);
        error.statusCode = 400;
        throw error;
    }
}

async function createSubjectResult(userId, examId, { subject, correctCount, wrongCount }) {
    assertValidSubject(subject);
    validateNonNegative('correctCount', correctCount);
    validateNonNegative('wrongCount', wrongCount);

    try {
        const created = await examSubjectResultsRepository.create({
            examId,
            userId,
            subject,
            correctCount,
            wrongCount,
        });

        if (!created) {
            const error = new Error('Sınav kaydı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return created;
    } catch (error) {
        if (error.code === '23505' && error.constraint === DUPLICATE_SUBJECT_CONSTRAINT) {
            const conflictError = new Error('Bu deneme için bu branşta zaten bir sonuç girilmiş.');
            conflictError.statusCode = 409;
            throw conflictError;
        }
        throw error;
    }
}

async function getSubjectSummary(userId) {
    const rows = await examSubjectResultsRepository.findSubjectSummaryByUserId(userId);
    const bySubject = new Map(rows.map((row) => [row.subject, row]));

    return ALLOWED_SUBJECTS.map((subject) => ({
        subject,
        correct_count: bySubject.get(subject)?.correct_count ?? 0,
        wrong_count: bySubject.get(subject)?.wrong_count ?? 0,
    }));
}

async function getExamSubjectResults(userId, examId) {
    const exam = await examsRepository.findByIdAndUserId(examId, userId);
    if (!exam) {
        const error = new Error('Sınav kaydı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    return examSubjectResultsRepository.findAllByExamId(examId, userId);
}

async function updateSubjectResult(userId, resultId, { correctCount, wrongCount }) {
    validateNonNegative('correctCount', correctCount);
    validateNonNegative('wrongCount', wrongCount);

    const updated = await examSubjectResultsRepository.update(resultId, userId, { correctCount, wrongCount });
    if (!updated) {
        const error = new Error('Branş sonucu bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    return updated;
}

async function deleteSubjectResult(userId, resultId) {
    const deleted = await examSubjectResultsRepository.deleteByIdAndUserId(resultId, userId);
    if (!deleted) {
        const error = new Error('Branş sonucu bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
}

function computeNet(correctCount, wrongCount) {
    return correctCount - wrongCount / 4;
}

async function getWeakSubjects(userId) {
    const rows = await examSubjectResultsRepository.findSubjectHistoryByUserId(userId);

    const bySubject = new Map();
    for (const row of rows) {
        const nets = bySubject.get(row.subject) ?? [];
        nets.push(computeNet(row.correct_count, row.wrong_count));
        bySubject.set(row.subject, nets);
    }

    const declining = [];
    for (const [subject, nets] of bySubject) {
        if (nets.length < 3) continue;

        const [first, second, third] = nets.slice(-3);
        if (first > second && second > third) {
            declining.push({ subject, nets: [first, second, third], drop: first - third });
        }
    }

    return declining.sort((a, b) => b.drop - a.drop);
}

module.exports = {
    createSubjectResult,
    getSubjectSummary,
    getExamSubjectResults,
    updateSubjectResult,
    deleteSubjectResult,
    getWeakSubjects,
};
