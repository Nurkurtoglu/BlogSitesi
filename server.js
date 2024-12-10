const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

// Bu, backend sunucusunun farklı portlardan gelen istekleri kabul etmesini sağlar.
const cors = require('cors');
app.use(cors());


// PostgreSQL bağlantısı
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tmdbveriler',
    password: 'i.nur0806',
    port: 5432,
});

// Film ekleme veya kontrol işlemi
app.post('/add-movie', async (req, res) => {
    const { tmdb_id, title, release_date, imdb_rating, overview } = req.body;

    console.log(req.body); // Burada gelen JSON verisini kontrol edebilirsiniz.


    try {
        // Veritabanında kontrol et
        const checkQuery = 'SELECT * FROM movies WHERE tmdb_id = $1';
        const checkResult = await pool.query(checkQuery, [tmdb_id]);

        if (checkResult.rows.length > 0) {
            return res.status(200).json({ message: 'Movie already exists in the database.' });
        }

        // Yeni film ekle
        const insertQuery = `
            INSERT INTO movies (tmdb_id, title, release_date, imdb_rating, overview)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(insertQuery, [tmdb_id, title, release_date, imdb_rating, overview]);

        res.status(201).json({ message: 'Movie added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Sunucuyu başlat
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


