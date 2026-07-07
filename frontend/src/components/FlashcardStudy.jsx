import { useState } from 'react';

function FlashcardStudy({ card, onDelete, onEdit }) {
    const [flipped, setFlipped] = useState(false);

    function handleDelete(event) {
        event.stopPropagation();
        onDelete(card.id);
    }

    function handleEdit(event) {
        event.stopPropagation();
        onEdit(card);
    }

    return (
        <div className="flip-card" onClick={() => setFlipped((f) => !f)}>
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
                <div className="flip-card-face flip-card-front">
                    <span className={`card-difficulty diff-${card.difficulty}`}>{card.difficulty}</span>
                    <p className="card-text">{card.question}</p>
                    <span className="card-subject">{card.subject}</span>
                </div>
                <div className="flip-card-face flip-card-back">
                    <p className="card-text">{card.answer}</p>
                </div>
            </div>
            <div className="card-actions">
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
