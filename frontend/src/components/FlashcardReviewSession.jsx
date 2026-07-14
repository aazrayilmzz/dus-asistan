import { useState } from 'react';

function FlashcardReviewSession({ cards, onRate, onFinish }) {
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);

    if (index >= cards.length) {
        return (
            <div className="review-session review-session-done">
                <p>Bugün için tekrar edilecek kart kalmadı. Harika iş!</p>
                <button className="auth-submit" onClick={onFinish}>
                    Bitir
                </button>
            </div>
        );
    }

    const card = cards[index];

    function handleRate(rating) {
        onRate(card, rating);
        setRevealed(false);
        setIndex((i) => i + 1);
    }

    return (
        <div className="review-session">
            <p className="review-session-progress">
                {index + 1} / {cards.length}
            </p>

            <div className="review-session-card">
                <span className="card-subject">{card.subject}</span>
                <p className="review-session-question">{card.question}</p>
                {revealed && <p className="review-session-answer">{card.answer}</p>}
            </div>

            {!revealed ? (
                <button className="auth-submit" onClick={() => setRevealed(true)}>
                    Cevabı Göster
                </button>
            ) : (
                <div className="review-session-ratings">
                    <button className="review-rate-btn review-rate-zor" onClick={() => handleRate('zor')}>
                        Zor
                    </button>
                    <button className="review-rate-btn review-rate-orta" onClick={() => handleRate('orta')}>
                        Orta
                    </button>
                    <button className="review-rate-btn review-rate-kolay" onClick={() => handleRate('kolay')}>
                        Kolay
                    </button>
                </div>
            )}

            <button type="button" className="review-session-exit" onClick={onFinish}>
                Oturumu Bitir
            </button>
        </div>
    );
}

export default FlashcardReviewSession;
