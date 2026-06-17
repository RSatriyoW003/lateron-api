const { Pool } = require('pg');
const pool = new Pool({

  user: 'postgres',
  host: 'localhost',
  database: 'Lateron_Update',
  password: 'Indonesia45',
  port: 5432,

  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
 
});
module.exports = pool;