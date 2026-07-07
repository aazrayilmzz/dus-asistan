CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(10) NOT NULL DEFAULT 'orta' CHECK (difficulty IN ('kolay', 'orta', 'zor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
