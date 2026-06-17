const { Pool } = require('pg');
const pool = new Pool({
<<<<<<< HEAD
  user: 'postgres',
  host: 'localhost',
  database: 'Lateron_Update',
  password: 'Indonesia45',
  port: 5432,
=======
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
>>>>>>> 753db4cf2ec0f5b1499383041a2724cb5e82d133
});
module.exports = pool;