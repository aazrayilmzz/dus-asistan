CREATE TABLE pomodoro_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100),
    duration_minutes INTEGER NOT NULL DEFAULT 25 CHECK (duration_minutes > 0),
    status VARCHAR(10) NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);

CREATE UNIQUE INDEX idx_pomodoro_sessions_one_active_per_user
    ON pomodoro_sessions(user_id) WHERE status = 'started';
