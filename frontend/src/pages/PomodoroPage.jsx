import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    startSession,
    completeSession,
    abandonSession,
    getActiveSession,
    getHistory,
    getWeeklySummary,
} from '../api/pomodoroApi';
import getErrorMessage from '../api/getErrorMessage';
import { EXAM_SUBJECTS } from '../constants/specialties';
import './PomodoroPage.css';

const DURATION_OPTIONS = [25, 45, 50];

function remainingSecondsFor(session) {
    const elapsedMs = Date.now() - new Date(session.started_at).getTime();
    const totalSeconds = session.duration_minutes * 60;
    return Math.max(0, totalSeconds - Math.floor(elapsedMs / 1000));
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatSessionLabel(session) {
    if (session.subject && session.detail) return `${session.subject} — ${session.detail}`;
    return session.subject || session.detail || '-';
}

function formatHours(totalMinutes) {
    if (totalMinutes < 60) return `${totalMinutes} dk`;
    return `${(totalMinutes / 60).toFixed(1)} saat`;
}

function PomodoroPage() {
    const [activeSession, setActiveSession] = useState(null);
    const [remaining, setRemaining] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [detail, setDetail] = useState('');
    const [duration, setDuration] = useState(25);
    const [starting, setStarting] = useState(false);
    const [weeklySummary, setWeeklySummary] = useState([]);
    const completingRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        Promise.all([getActiveSession(), getHistory()])
            .then(([active, sessions]) => {
                if (cancelled) return;
                setActiveSession(active);
                if (active) setRemaining(remainingSecondsFor(active));
                setHistory(sessions);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        getWeeklySummary()
            .then((result) => {
                if (!cancelled) setWeeklySummary(result);
            })
            .catch(() => {
                if (!cancelled) setWeeklySummary([]);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!activeSession) return undefined;

        const interval = setInterval(() => {
            const secondsLeft = remainingSecondsFor(activeSession);
            setRemaining(secondsLeft);

            if (secondsLeft === 0 && !completingRef.current) {
                completingRef.current = true;
                completeSession(activeSession.id)
                    .then((completed) => {
                        setHistory((prev) => [completed, ...prev]);
                        setActiveSession(null);
                        getWeeklySummary().then(setWeeklySummary).catch(() => {});
                    })
                    .catch((err) => setError(getErrorMessage(err)))
                    .finally(() => {
                        completingRef.current = false;
                    });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    async function handleStart(event) {
        event.preventDefault();
        setError('');
        setStarting(true);

        try {
            const session = await startSession({
                subject: specialty || undefined,
                detail: detail.trim() || undefined,
                durationMinutes: duration,
            });
            setActiveSession(session);
            setRemaining(remainingSecondsFor(session));
        } catch (err) {
            if (err.response?.status === 409) {
                const active = await getActiveSession();
                setActiveSession(active);
                if (active) setRemaining(remainingSecondsFor(active));
            } else {
                setError(getErrorMessage(err));
            }
        } finally {
            setStarting(false);
        }
    }

    async function handleComplete() {
        try {
            const completed = await completeSession(activeSession.id);
            setHistory((prev) => [completed, ...prev]);
            setActiveSession(null);
            getWeeklySummary().then(setWeeklySummary).catch(() => {});
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleAbandon() {
        try {
            const abandoned = await abandonSession(activeSession.id);
            setHistory((prev) => [abandoned, ...prev]);
            setActiveSession(null);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    const completedMinutes = history
        .filter((session) => session.status === 'completed')
        .reduce((sum, session) => sum + session.duration_minutes, 0);
    const pastSessions = history.filter((session) => session.status !== 'started');

    return (
        <div className="pomodoro-page">
            <header className="pomodoro-header">
                <Link to="/" className="pomodoro-back">← Ana Sayfa</Link>
                <h1>Pomodoro</h1>
                <span />
            </header>

            {error && <div className="auth-error">{error}</div>}

            {loading ? (
                <p className="pomodoro-status">Yükleniyor...</p>
            ) : activeSession ? (
                <div className="pomodoro-timer-card">
                    <p className="pomodoro-timer-subject">
                        {formatSessionLabel(activeSession) !== '-' ? formatSessionLabel(activeSession) : 'Odaklanma zamanı'}
                    </p>
                    <div className="pomodoro-timer-display">{formatTime(remaining)}</div>
                    <div className="pomodoro-timer-actions">
                        <button className="pomodoro-abandon" onClick={handleAbandon}>
                            Vazgeç
                        </button>
                        <button className="auth-submit" onClick={handleComplete}>
                            Tamamla
                        </button>
                    </div>
                </div>
            ) : (
                <form className="pomodoro-start-card" onSubmit={handleStart}>
                    <div className="field">
                        <label htmlFor="specialty">Branş</label>
                        <select id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                            <option value="">Seçiniz (opsiyonel)</option>
                            {EXAM_SUBJECTS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label htmlFor="detail">Konu detayı</label>
                        <input
                            id="detail"
                            type="text"
                            placeholder="Örn: Kök Kanal Preparasyonu"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>Süre</label>
                        <div className="pomodoro-duration-options">
                            {DURATION_OPTIONS.map((minutes) => (
                                <button
                                    type="button"
                                    key={minutes}
                                    className={`pomodoro-duration-btn${duration === minutes ? ' active' : ''}`}
                                    onClick={() => setDuration(minutes)}
                                >
                                    {minutes} dk
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="auth-submit" disabled={starting}>
                        {starting ? 'Başlatılıyor...' : 'Odaklanmayı Başlat'}
                    </button>
                </form>
            )}

            <div className="pomodoro-stats">
                <span>Tamamlanan oturum: <strong>{history.filter((s) => s.status === 'completed').length}</strong></span>
                <span>Toplam odaklanma: <strong>{completedMinutes} dk</strong></span>
            </div>

            {weeklySummary.length > 0 && (
                <div className="pomodoro-weekly-summary">
                    <h2>Bu Hafta Branş Dağılımı</h2>
                    <ul>
                        {weeklySummary.map((row) => (
                            <li key={row.subject}>
                                <span>{row.subject}</span>
                                <strong>{formatHours(row.totalMinutes)}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {pastSessions.length > 0 && (
                <div className="pomodoro-history-wrapper">
                    <table className="pomodoro-history-table">
                        <thead>
                            <tr>
                                <th>Konu</th>
                                <th>Süre</th>
                                <th>Durum</th>
                                <th>Başlangıç</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastSessions.map((session) => (
                                <tr key={session.id}>
                                    <td>{formatSessionLabel(session)}</td>
                                    <td>{session.duration_minutes} dk</td>
                                    <td>
                                        <span className={`pomodoro-badge pomodoro-badge-${session.status}`}>
                                            {session.status === 'completed' ? 'Tamamlandı' : 'Yarım Kaldı'}
                                        </span>
                                    </td>
                                    <td>{new Date(session.started_at).toLocaleString('tr-TR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PomodoroPage;
