ALTER TABLE exam_subject_results DROP CONSTRAINT exam_subject_results_subject_check;

ALTER TABLE exam_subject_results ADD CONSTRAINT exam_subject_results_subject_check CHECK (subject IN (
    'Ağız, Diş ve Çene Cerrahisi',
    'Ağız, Diş ve Çene Radyolojisi',
    'Endodonti',
    'Ortodonti',
    'Pedodonti',
    'Periodontoloji',
    'Protetik Diş Tedavisi',
    'Restoratif Diş Tedavisi',
    'Anatomi',
    'Fizyoloji',
    'Biyokimya',
    'Histoloji-Embriyoloji',
    'Mikrobiyoloji',
    'Patoloji',
    'Farmakoloji'
));
