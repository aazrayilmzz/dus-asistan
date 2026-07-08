const { Pool, types } = require('pg');

// DATE sütunlarını Date nesnesine çevirmeden ham 'YYYY-MM-DD' string olarak döndür.
// Aksi halde pg, yerel saat dilimine göre Date objesi üretiyor ve JSON'a
// çevrilirken UTC'ye kayarak günü bir öncekine kaydırabiliyor.
types.setTypeParser(types.builtins.DATE, (value) => value);

// DATABASE_URL varsa (Render/Neon gibi canlı ortamlarda) onu SSL ile kullan;
// yoksa yerel Docker Postgres için ayrı ayrı DB_* değişkenlerine düş.
const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({
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
