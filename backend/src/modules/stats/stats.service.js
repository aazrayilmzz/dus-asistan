const statsRepository = require('./stats.repository');

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayString() {
    return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function daysAgoString(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Kullanıcı o gün en az bir soru çözdüğünde/kart çalıştığında çağrılır.
// Ardışık günse streak'i artırır, bir gün atlanmışsa 1'e sıfırlar, aynı günse hiçbir şey yapmaz.
async function recordActivity(userId) {
    const current = await statsRepository.getStreakFields(userId);
    if (!current) return;

    const today = todayString();
    if (current.last_activity_date === today) return;

    const nextStreak = current.last_activity_date === yesterdayString() ? current.current_streak + 1 : 1;
    const nextLongest = Math.max(current.longest_streak, nextStreak);

    await statsRepository.updateStreakFields(userId, {
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastActivityDate: today,
    });
}

async function recordFlashcardReview(userId, { flashcardId, subject, rating }) {
    await statsRepository.createFlashcardReview({ userId, flashcardId, subject, rating });
    await recordActivity(userId);
}

async function getStreak(userId) {
    const fields = await statsRepository.getStreakFields(userId);
    if (!fields) return { currentStreak: 0, longestStreak: 0 };

    // Son aktivite bugün veya dünden değilse seri fiilen kırılmıştır;
    // DB'ye ancak bir sonraki aktivitede yazılır ama burada 0 olarak gösteririz.
    const isActive = fields.last_activity_date === todayString() || fields.last_activity_date === yesterdayString();

    return {
        currentStreak: isActive ? fields.current_streak : 0,
        longestStreak: fields.longest_streak,
    };
}

async function getWeeklySummary(userId) {
    const since = daysAgoString(6); // bugün dahil son 7 gün

    const [flashcardRows, examTotals, examSubjectRows] = await Promise.all([
        statsRepository.getWeeklyFlashcardStats(userId, since),
        statsRepository.getWeeklyExamTotals(userId, since),
        statsRepository.getWeeklyExamSubjectStats(userId, since),
    ]);

    let flashcardCorrect = 0;
    let flashcardWrong = 0;
    const subjectCounts = new Map();

    for (const row of flashcardRows) {
        // "Zor" işaretlenen kart yanlış cevap kabul edilir (Hata Kutusu ile aynı mantık).
        if (row.rating === 'zor') {
            flashcardWrong += row.count;
        } else {
            flashcardCorrect += row.count;
        }
        subjectCounts.set(row.subject, (subjectCounts.get(row.subject) || 0) + row.count);
    }

    for (const row of examSubjectRows) {
        const total = row.correct_count + row.wrong_count;
        subjectCounts.set(row.subject, (subjectCounts.get(row.subject) || 0) + total);
    }

    const correctCount = flashcardCorrect + examTotals.correct_count;
    const wrongCount = flashcardWrong + examTotals.wrong_count;
    const totalQuestions = correctCount + wrongCount;
    const accuracyPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : null;

    const bySubject = [...subjectCounts.entries()]
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count);

    return { totalQuestions, correctCount, wrongCount, accuracyPct, bySubject };
}

module.exports = {
    recordActivity,
    recordFlashcardReview,
    getStreak,
    getWeeklySummary,
};
