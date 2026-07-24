import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoIcon from '../assets/logo-icon.png';
import { updateProfile } from '../api/authApi';
import { getWeakSubjects } from '../api/examsApi';
import { getStreak, getWeeklySummary } from '../api/statsApi';
import { getTipOfTheDay } from '../constants/dailyTips';

function FlashcardIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="14" height="14" rx="2" />
            <path d="M7 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
        </svg>
    );
}

function ExamIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 3v2h6V3M8 12l2 2 4-4M8 17h6" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l3 2M9 2h6" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20V11M11 20V5M17 20v-6M21 20H3" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.5l2.86 6.28 6.9.68-5.2 4.62 1.55 6.78L12 17.6l-6.11 3.26 1.55-6.78-5.2-4.62 6.9-.68L12 2.5z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
    );
}

function TrendDownIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7l7 7 4-4 5 5M15 15h5v-5" />
        </svg>
    );
}

function FlameIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z" />
        </svg>
    );
}

function toTitleCase(fullName) {
    return fullName
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR'))
        .join(' ');
}

function getDaysUntil(targetDateStr) {
    const target = new Date(`${targetDateStr}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (24 * 60 * 60 * 1000));
}

function getExamProgress(createdAt, targetExamDate) {
    if (!createdAt || !targetExamDate) return null;

    const start = new Date(createdAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date(`${targetExamDate}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const totalMs = end - start;
    if (totalMs <= 0) return null;

    const pct = ((now - start) / totalMs) * 100;
    return Math.min(100, Math.max(0, pct));
}

const MENU_ITEMS = [
    { to: '/flashcards', label: 'Çalışma Kartları', Icon: FlashcardIcon },
    { to: '/exams', label: 'Denemeler', Icon: ExamIcon },
    { to: '/pomodoro', label: 'Pomodoro', Icon: ClockIcon },
    { to: '/dashboard', label: 'İlerleme Grafikleri', Icon: ChartIcon },
    { to: '/flashcards?needsReview=true', label: 'Hata Kutusu', Icon: StarIcon },
];

function ExamCountdown({ targetExamDate, createdAt, onSave }) {
    const [editing, setEditing] = useState(!targetExamDate);
    const [date, setDate] = useState('');
    const [saving, setSaving] = useState(false);

    if (editing) {
        return (
            <form
                className="countdown-card countdown-setup"
                onSubmit={async (event) => {
                    event.preventDefault();
                    if (!date) return;
                    setSaving(true);
                    await onSave(date);
                    setSaving(false);
                    setEditing(false);
                }}
            >
                <label htmlFor="targetExamDate">DUS sınav tarihini belirle</label>
                <div className="countdown-setup-row">
                    <input
                        id="targetExamDate"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                    />
                    <button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        );
    }

    const daysLeft = getDaysUntil(targetExamDate);
    const progressPct = getExamProgress(createdAt, targetExamDate);

    return (
        <div className="countdown-card">
            {daysLeft > 0 && (
                <>
                    <span className="countdown-number">{daysLeft}</span>
                    <span className="countdown-label">DUS'a kalan gün</span>
                </>
            )}
            {daysLeft === 0 && <span className="countdown-label">Bugün DUS günü, başarılar!</span>}
            {daysLeft < 0 && <span className="countdown-label">Sınav tarihin geçti.</span>}
            {progressPct !== null && (
                <div className="countdown-progress">
                    <div className="countdown-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
            )}
            <button type="button" className="countdown-edit" onClick={() => setEditing(true)}>
                Tarihi değiştir
            </button>
        </div>
    );
}

function StreakBadge({ streak }) {
    if (!streak || streak.currentStreak <= 0) return null;

    return (
        <div className="header-streak" title={`En uzun serin: ${streak.longestStreak} gün`}>
            <FlameIcon />
            <span>{streak.currentStreak} gün</span>
        </div>
    );
}

function WeeklySummaryCard({ summary }) {
    if (!summary || summary.totalQuestions === 0) {
        return (
            <div className="countdown-card weekly-summary-card">
                <span className="countdown-label">
                    Bu hafta henüz soru çözmedin. Çalışma kartları veya deneme ekleyerek başlayabilirsin.
                </span>
            </div>
        );
    }

    const topSubjects = summary.bySubject.slice(0, 3);

    return (
        <div className="countdown-card weekly-summary-card">
            <span className="weekly-summary-headline">
                Bu hafta: <strong>{summary.totalQuestions} soru</strong> çözdün
                {summary.accuracyPct !== null && (
                    <>
                        , <strong>%{summary.accuracyPct}</strong> başarı
                    </>
                )}
            </span>
            {topSubjects.length > 0 && (
                <ul className="weekly-summary-subjects">
                    {topSubjects.map((row) => (
                        <li key={row.subject}>
                            <span>{row.subject}</span>
                            <span>{row.count}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function WeakSubjectNudge({ weakSubject }) {
    if (!weakSubject) return null;

    return (
        <div className="weak-subject-nudge">
            <TrendDownIcon />
            <p>
                Son 3 denemedir <strong>{weakSubject.subject}</strong> netlerin düşüşte. Bu hafta o branşın çalışma
                kartlarına göz atmak ister misin?
            </p>
            <Link to={`/flashcards?subject=${encodeURIComponent(weakSubject.subject)}`} className="weak-subject-cta">
                Çalışma Kartlarına Git
            </Link>
        </div>
    );
}

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dusasistan_user')));
    const [weakSubjects, setWeakSubjects] = useState([]);
    const [streak, setStreak] = useState(null);
    const [weeklySummary, setWeeklySummary] = useState(null);

    useEffect(() => {
        getWeakSubjects()
            .then(setWeakSubjects)
            .catch(() => setWeakSubjects([]));

        getStreak()
            .then(setStreak)
            .catch(() => setStreak(null));

        getWeeklySummary()
            .then(setWeeklySummary)
            .catch(() => setWeeklySummary(null));
    }, []);

    function handleLogout() {
        localStorage.removeItem('dusasistan_token');
        localStorage.removeItem('dusasistan_user');
        navigate('/login');
    }

    async function handleSaveExamDate(targetExamDate) {
        const updated = await updateProfile({ targetExamDate });
        const nextUser = { ...user, targetExamDate: updated.targetExamDate };
        localStorage.setItem('dusasistan_user', JSON.stringify(nextUser));
        setUser(nextUser);
    }

    return (
        <div className="home-page">
            <header className="home-topbar">
                <StreakBadge streak={streak} />
                <div className="home-brand">
                    <img src={logoIcon} className="home-logo" alt="DUS Asistan" />
                    <span className="home-brand-name">DUS Asistan</span>
                </div>
                <button className="home-logout" onClick={handleLogout} title="Çıkış Yap" aria-label="Çıkış Yap">
                    <LogoutIcon />
                </button>
            </header>

            <div className="home-greeting">
                <h1>Hoş geldin, {toTitleCase(user.fullName)}</h1>
                <p>{user.targetSpecialty ? `Hedef branş: ${user.targetSpecialty}` : 'Henüz bir hedef branş seçmedin.'}</p>
            </div>

            <div className="home-stats-row">
                <ExamCountdown targetExamDate={user.targetExamDate} createdAt={user.createdAt} onSave={handleSaveExamDate} />
                <WeeklySummaryCard summary={weeklySummary} />
            </div>

            <WeakSubjectNudge weakSubject={weakSubjects[0]} />

            <p className="daily-tip">{getTipOfTheDay()}</p>

            <nav className="home-grid">
                {MENU_ITEMS.map(({ to, label, Icon }) => (
                    <Link key={to} to={to} className="home-card">
                        <Icon />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default HomePage;
