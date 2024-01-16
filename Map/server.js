
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 5500;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni_pune',
  password: 'pucsd',
  port: 5432,
});

app.use(express.static('public')); 


app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, loctype, ST_X(ST_Transform(geom, 4326)) AS long, ST_Y(ST_Transform(geom, 4326)) AS lat FROM newpoint where name is not null');
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/api/find_shortest_path', async (req, res) => {
  const { startLat, startLng, destLat, destLng } = req.query;

  console.log('Received request with parameters:', req.query);

  try {
    const result = await pool.query(`
      SELECT * FROM find_shortest_path(
        ST_SetSRID(ST_MakePoint(${startLng}, ${startLat}), 4326),
        ST_SetSRID(ST_MakePoint(${destLng}, ${destLat}), 4326)
      );
    `);

    console.log('SQL Query:', result);
    console.log('Database query result:', result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error('Error executing find_shortest_path:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  const result = await searchDatabase(query);
  res.json(result);
});


async function searchDatabase(query) {
  try {
    const result = await pool.query('SELECT loctype FROM newpoint WHERE loctype is not null', [`%${query}%`]);
    return result.rows;
  } catch (error) {
    console.error('Error in searchDatabase:', error);
    throw error; 
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = pool;