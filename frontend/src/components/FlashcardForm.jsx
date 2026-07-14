import { useState } from 'react';
import { EXAM_SUBJECTS, DIFFICULTIES } from '../constants/specialties';

const EMPTY_FORM = { question: '', answer: '', subject: EXAM_SUBJECTS[0], difficulty: 'orta' };

function FlashcardForm({ initialCard, onSubmit, onCancel }) {
    const isEditing = !!initialCard;
    const [formData, setFormData] = useState(
        isEditing
            ? {
                question: initialCard.question,
                answer: initialCard.answer,
                subject: initialCard.subject,
                difficulty: initialCard.difficulty,
            }
            : EMPTY_FORM
    );
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
            await onSubmit(formData);
            if (!isEditing) setFormData(EMPTY_FORM);
        } catch (err) {
            setError(err.message || 'Kart kaydedilemedi.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="flashcard-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="field">
                <label htmlFor="question">Soru</label>
                <textarea id="question" name="question" value={formData.question} onChange={handleChange} required />
            </div>

            <div className="field">
                <label htmlFor="answer">Cevap</label>
                <textarea id="answer" name="answer" value={formData.answer} onChange={handleChange} required />
            </div>

            <div className="flashcard-form-row">
                <div className="field">
                    <label htmlFor="subject">Branş</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                        {EXAM_SUBJECTS.map((specialty) => (
                            <option key={specialty} value={specialty}>
                                {specialty}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="difficulty">Zorluk</label>
                    <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                        {DIFFICULTIES.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flashcard-form-actions">
                <button type="button" className="flashcard-cancel" onClick={onCancel}>
                    Vazgeç
                </button>
                <button type="submit" className="auth-submit" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Kartı Ekle'}
                </button>
            </div>
        </form>
    );
}

export default FlashcardForm;
