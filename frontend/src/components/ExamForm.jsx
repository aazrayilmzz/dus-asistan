import { useState } from 'react';
import { SPECIALTIES } from '../constants/specialties';

function todayIso() {
    return new Date().toISOString().slice(0, 10);
}

function emptySubjectRows() {
    return SPECIALTIES.reduce((acc, subject) => {
        acc[subject] = { correct: '', wrong: '' };
        return acc;
    }, {});
}

function toFormState(exam) {
    return {
        examName: exam.exam_name,
        examDate: exam.exam_date,
        correctCount: String(exam.correct_count),
        wrongCount: String(exam.wrong_count),
        blankCount: String(exam.blank_count),
    };
}

const EMPTY_FORM = { examName: '', examDate: todayIso(), correctCount: '', wrongCount: '', blankCount: '' };

function ExamForm({ initialExam, onSubmit, onCancel }) {
    const isEditing = !!initialExam;
    const [formData, setFormData] = useState(isEditing ? toFormState(initialExam) : EMPTY_FORM);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [showSubjects, setShowSubjects] = useState(false);
    const [subjectRows, setSubjectRows] = useState(emptySubjectRows);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubjectRowChange(subject, field, value) {
        setSubjectRows((prev) => ({
            ...prev,
            [subject]: { ...prev[subject], [field]: value },
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);

        const subjectResults = Object.entries(subjectRows)
            .filter(([, { correct, wrong }]) => correct !== '' || wrong !== '')
            .map(([subject, { correct, wrong }]) => ({
                subject,
                correctCount: Number(correct) || 0,
                wrongCount: Number(wrong) || 0,
            }));

        try {
            await onSubmit({
                examName: formData.examName,
                examDate: formData.examDate,
                correctCount: Number(formData.correctCount),
                wrongCount: Number(formData.wrongCount),
                blankCount: Number(formData.blankCount),
                subjectResults,
            });
            if (!isEditing) {
                setFormData(EMPTY_FORM);
                setSubjectRows(emptySubjectRows());
                setShowSubjects(false);
            }
        } catch (err) {
            setError(err.message || 'Sınav kaydedilemedi.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="exam-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="field">
                <label htmlFor="examName">Sınav Adı</label>
                <input
                    id="examName"
                    name="examName"
                    type="text"
                    value={formData.examName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="exam-form-row">
                <div className="field">
                    <label htmlFor="examDate">Tarih</label>
                    <input
                        id="examDate"
                        name="examDate"
                        type="date"
                        value={formData.examDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="correctCount">Doğru</label>
                    <input
                        id="correctCount"
                        name="correctCount"
                        type="number"
                        min="0"
                        value={formData.correctCount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="wrongCount">Yanlış</label>
                    <input
                        id="wrongCount"
                        name="wrongCount"
                        type="number"
                        min="0"
                        value={formData.wrongCount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="blankCount">Boş</label>
                    <input
                        id="blankCount"
                        name="blankCount"
                        type="number"
                        min="0"
                        value={formData.blankCount}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {!isEditing && (
                <div className="exam-subjects">
                    <button
                        type="button"
                        className="exam-subjects-toggle"
                        onClick={() => setShowSubjects((prev) => !prev)}
                    >
                        {showSubjects ? '− Branş bazında sonuçları gizle' : '+ Branş bazında sonuç ekle (opsiyonel)'}
                    </button>

                    {showSubjects && (
                        <div className="exam-subjects-grid">
                            {SPECIALTIES.map((subject) => (
                                <div key={subject} className="exam-subject-row">
                                    <span className="exam-subject-name">{subject}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Doğru"
                                        value={subjectRows[subject].correct}
                                        onChange={(event) =>
                                            handleSubjectRowChange(subject, 'correct', event.target.value)
                                        }
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Yanlış"
                                        value={subjectRows[subject].wrong}
                                        onChange={(event) =>
                                            handleSubjectRowChange(subject, 'wrong', event.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="exam-form-actions">
                <button type="button" className="exam-cancel" onClick={onCancel}>
                    Vazgeç
                </button>
                <button type="submit" className="auth-submit" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Sınavı Ekle'}
                </button>
            </div>
        </form>
    );
}

export default ExamForm;
