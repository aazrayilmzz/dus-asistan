import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listExams, createExam, updateExam, deleteExam, createSubjectResult } from '../api/examsApi';
import getErrorMessage from '../api/getErrorMessage';
import ExamForm from '../components/ExamForm';
import './ExamsPage.css';

function ExamsPage() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingExam, setEditingExam] = useState(null);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');
        listExams()
            .then((data) => {
                if (!cancelled) setExams(data);
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

    function openCreateForm() {
        setEditingExam(null);
        setShowForm(true);
    }

    function openEditForm(exam) {
        setEditingExam(exam);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingExam(null);
    }

    async function handleSubmit({ subjectResults, ...formData }) {
        try {
            if (editingExam) {
                const updated = await updateExam(editingExam.id, formData);
                setExams((prev) => prev.map((exam) => (exam.id === updated.id ? updated : exam)));
            } else {
                const created = await createExam(formData);
                setExams((prev) =>
                    [created, ...prev].sort((a, b) => (a.exam_date < b.exam_date ? 1 : -1))
                );

                if (subjectResults?.length) {
                    try {
                        await Promise.all(
                            subjectResults.map((result) => createSubjectResult(created.id, result))
                        );
                    } catch (subjectErr) {
                        setError(
                            `Deneme eklendi ama branş sonuçları kaydedilirken bir sorun oluştu: ${getErrorMessage(subjectErr)}`
                        );
                    }
                }
            }
            closeForm();
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }

    async function handleDelete(id) {
        const previousExams = exams;
        setExams((prev) => prev.filter((exam) => exam.id !== id));

        try {
            await deleteExam(id);
        } catch (err) {
            setExams(previousExams);
            setError(getErrorMessage(err));
        }
    }

    return (
        <div className="exams-page">
            <header className="exams-header">
                <Link to="/" className="exams-back">← Ana Sayfa</Link>
                <h1>Denemeler</h1>
                <button className="auth-submit" onClick={() => (showForm ? closeForm() : openCreateForm())}>
                    {showForm ? 'Kapat' : '+ Yeni Deneme'}
                </button>
            </header>

            <Link to="/dashboard" className="exams-dashboard-link">İlerleme Grafiklerini Gör →</Link>

            {showForm && <ExamForm initialExam={editingExam} onSubmit={handleSubmit} onCancel={closeForm} />}

            {error && <div className="auth-error">{error}</div>}

            {loading ? (
                <p className="exams-status">Yükleniyor...</p>
            ) : exams.length === 0 ? (
                <p className="exams-status">Henüz deneme kaydı yok. Yukarıdan ilk denemeni ekle!</p>
            ) : (
                <>
                <div className="exams-table-wrapper">
                    <table className="exams-table">
                        <thead>
                            <tr>
                                <th>Sınav</th>
                                <th>Tarih</th>
                                <th>Doğru</th>
                                <th>Yanlış</th>
                                <th>Boş</th>
                                <th>Net</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>{exam.exam_name}</td>
                                    <td>{exam.exam_date}</td>
                                    <td>{exam.correct_count}</td>
                                    <td>{exam.wrong_count}</td>
                                    <td>{exam.blank_count}</td>
                                    <td className="exam-net">{Number(exam.net)}</td>
                                    <td className="exam-row-actions">
                                        <button className="card-action-btn" onClick={() => openEditForm(exam)}>
                                            ✎
                                        </button>
                                        <button
                                            className="card-action-btn card-delete"
                                            onClick={() => handleDelete(exam.id)}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
        </div>
    );
}

export default ExamsPage;
