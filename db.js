const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Lateron_Update',
  password: 'Indonesia45',
  port: 5432,
});
module.exports = pool;