CREATE TABLE flashcard_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    rating VARCHAR(10) NOT NULL CHECK (rating IN ('kolay', 'orta', 'zor')),
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flashcard_reviews_user_id ON flashcard_reviews(user_id);
CREATE INDEX idx_flashcard_reviews_reviewed_at ON flashcard_reviews(reviewed_at);
