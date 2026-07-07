import { useState } from 'react';

function FlashcardStudy({ card, onDelete }) {
    const [flipped, setFlipped] = useState(false);

    function handleDelete(event) {
        event.stopPropagation();
        onDelete(card.id);
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
            <button className="card-delete" onClick={handleDelete} title="Kartı sil">
                ×
            </button>
        </div>
    );
}

export default FlashcardStudy;
