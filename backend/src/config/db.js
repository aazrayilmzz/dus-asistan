const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
    console.error('❌ Beklenmeyen veritabanı hatası:', err.message);
});

pool.connect()
    .then((client) => {
        console.log('✅ PostgreSQL veritabanına bağlantı başarılı.');
        client.release();
    })
    .catch((err) => {
        console.error('❌ PostgreSQL veritabanına bağlanılamadı:', err.message);
    });

module.exports = pool;
