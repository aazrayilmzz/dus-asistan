const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// .env dosyasındaki değişkenleri yükle
dotenv.config();

// Veritabanı bağlantısını başlat (bağlantı testi db.js içinde loglanır)
require('./config/db');

const authRoutes = require('./modules/auth/auth.routes');
const flashcardsRoutes = require('./modules/flashcards/flashcards.routes');
const examsRoutes = require('./modules/exams/exams.routes');
const pomodoroRoutes = require('./modules/pomodoro/pomodoro.routes');

const app = express();

// Global Middleware Kurulumları
app.use(helmet());       // Güvenlik başlıkları için
app.use(cors());         // Frontend ile iletişim için
app.use(express.json()); // Gelen JSON isteklerini okuyabilmek için

// Sağlık Kontrolü (Test) Rotası
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "DUSAsistan API aktif ve çalışıyor!"
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/pomodoro', pomodoroRoutes);

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu, ${PORT} portu üzerinde başarıyla ayağa kalktı...`);
});
