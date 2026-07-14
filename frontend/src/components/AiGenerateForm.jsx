import { useState } from 'react';
import { EXAM_SUBJECTS } from '../constants/specialties';

function AiGenerateForm({ onGenerate, onCancel }) {
    const [subject, setSubject] = useState(EXAM_SUBJECTS[0]);
    const [count, setCount] = useState(5);
    const [error, setError] = useState('');
    const [generating, setGenerating] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setGenerating(true);

        try {
            await onGenerate({ subject, count: Number(count) });
        } catch (err) {
            setError(err.message || 'Sorular üretilemedi.');
        } finally {
            setGenerating(false);
        }
    }

    return (
        <form className="ai-generate-form" onSubmit={handleSubmit}>
            <p className="ai-generate-note">
                Sorular Claude tarafından üretilir — DUS tarzında pratik sorulardır, gerçek çıkmış sınav soruları
                değildir.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <div className="ai-generate-row">
                <div className="field">
                    <label htmlFor="ai-subject">Branş</label>
                    <select id="ai-subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
                        {EXAM_SUBJECTS.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="ai-count">Kaç soru</label>
                    <input
                        id="ai-count"
                        type="number"
                        min="1"
                        max="20"
                        value={count}
                        onChange={(event) => setCount(event.target.value)}
                    />
                </div>
            </div>

            <div className="flashcard-form-actions">
                <button type="button" className="flashcard-cancel" onClick={onCancel} disabled={generating}>
                    Vazgeç
                </button>
                <button type="submit" className="auth-submit" disabled={generating}>
                    {generating ? 'Üretiliyor...' : 'Üret'}
                </button>
            </div>
        </form>
    );
}

export default AiGenerateForm;
