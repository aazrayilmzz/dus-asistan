CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_name VARCHAR(150) NOT NULL,
    exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
    correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
    wrong_count INTEGER NOT NULL CHECK (wrong_count >= 0),
    blank_count INTEGER NOT NULL DEFAULT 0 CHECK (blank_count >= 0),
    net NUMERIC(6,2) NOT NULL,
    score NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_user_id ON exams(user_id);
