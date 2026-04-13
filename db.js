const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lateron_db',
  password: 'Indonesia45',
  port: 5432,
});

module.exports = pool;