CREATE TABLE exam_subject_results (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL CHECK (subject IN (
        'Ağız, Diş ve Çene Cerrahisi',
        'Ağız, Diş ve Çene Radyolojisi',
        'Endodonti',
        'Ortodonti',
        'Pedodonti',
        'Periodontoloji',
        'Protetik Diş Tedavisi',
        'Restoratif Diş Tedavisi'
    )),
    correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
    wrong_count INTEGER NOT NULL CHECK (wrong_count >= 0),
    UNIQUE (exam_id, subject)
);

CREATE INDEX idx_exam_subject_results_exam_id ON exam_subject_results(exam_id);
