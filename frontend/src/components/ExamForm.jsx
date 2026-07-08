import { useState } from 'react';

function todayIso() {
    return new Date().toISOString().slice(0, 10);
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

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSubmit({
                examName: formData.examName,
                examDate: formData.examDate,
                correctCount: Number(formData.correctCount),
                wrongCount: Number(formData.wrongCount),
                blankCount: Number(formData.blankCount),
            });
            if (!isEditing) setFormData(EMPTY_FORM);
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
