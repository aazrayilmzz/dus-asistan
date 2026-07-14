import { useState } from 'react';

function FlashcardStudy({ card, onDelete, onEdit, onToggleReview }) {
    const [flipped, setFlipped] = useState(false);

    function handleDelete(event) {
        event.stopPropagation();
        onDelete(card.id);
    }

    function handleEdit(event) {
        event.stopPropagation();
        onEdit(card);
    }

    function handleToggleReview(event) {
        event.stopPropagation();
        onToggleReview(card);
    }

    return (
        <div className={`flip-card ${card.needs_review ? 'flip-card-flagged' : ''}`} onClick={() => setFlipped((f) => !f)}>
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
                <div className="flip-card-face flip-card-front">
                    <span className={`card-difficulty diff-${card.difficulty}`}>{card.difficulty}</span>
                    {card.is_ai_generated && <span className="card-ai-badge">AI Üretimi</span>}
                    <p className="card-text">{card.question}</p>
                    <span className="card-subject">{card.subject}</span>
                </div>
                <div className="flip-card-face flip-card-back">
                    <p className="card-text">{card.answer}</p>
                </div>
            </div>
            <div className="card-actions">
                <button
                    className={`card-action-btn card-flag ${card.needs_review ? 'active' : ''}`}
                    onClick={handleToggleReview}
                    title={card.needs_review ? 'Hata kutusundan çıkar' : 'Hata kutusuna ekle'}
                >
                    {card.needs_review ? '★' : '☆'}
                </button>
                <button className="card-action-btn" onClick={handleEdit} title="Kartı düzenle">
                    ✎
                </button>
                <button className="card-action-btn card-delete" onClick={handleDelete} title="Kartı sil">
                    ×
                </button>
            </div>
        </div>
    );
}

export default FlashcardStudy;
