import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listExams, getSubjectSummary } from '../api/examsApi';
import getErrorMessage from '../api/getErrorMessage';
import ExamProgressChart from '../components/ExamProgressChart';
import SubjectDistributionChart from '../components/SubjectDistributionChart';
import './ExamsPage.css';
import './DashboardPage.css';

function DashboardPage() {
    const [exams, setExams] = useState([]);
    const [subjectSummary, setSubjectSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');
        Promise.all([listExams(), getSubjectSummary()])
            .then(([examsData, summaryData]) => {
                if (cancelled) return;
                setExams(examsData);
                setSubjectSummary(summaryData);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const hasSubjectData = subjectSummary.some((row) => Number(row.correct_count) > 0 || Number(row.wrong_count) > 0);

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <Link to="/" className="dashboard-back">← Ana Sayfa</Link>
                <h1>İlerleme Grafikleri</h1>
                <span />
            </header>

            {error && <div className="auth-error">{error}</div>}

            {loading ? (
                <p className="dashboard-status">Yükleniyor...</p>
            ) : (
                <>
                    {exams.length > 1 ? (
                        <ExamProgressChart exams={exams} />
                    ) : (
                        <p className="dashboard-status">
                            Net gelişimini görebilmek için en az 2 deneme kaydın olması gerekiyor.
                        </p>
                    )}

                    {hasSubjectData ? (
                        <SubjectDistributionChart summary={subjectSummary} />
                    ) : (
                        <p className="dashboard-status">
                            Henüz branş bazında sonuç girilmemiş. Yeni deneme eklerken branş sonuçlarını da girerek bu
                            grafiği doldurabilirsin.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default DashboardPage;
