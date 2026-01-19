import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Set your MySQL password here
  database: 'booksorter'
};

const pool = mysql.createPool(dbConfig);

// Initialize database and table
const initDB = async () => {
  try {
    // Create database if not exists
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    await connection.execute('CREATE DATABASE IF NOT EXISTS booksorter');
    await connection.end();

    // Create table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        status ENUM('To Be Read', 'Reading', 'Finished') DEFAULT 'To Be Read'
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDB();

app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author } = req.body;
    const [result] = await pool.execute('INSERT INTO books (title, author) VALUES (?, ?)', [title, author]);
    const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    await pool.execute('UPDATE books SET status = ? WHERE id = ?', [status, id]);
    const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.execute('DELETE FROM books WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));