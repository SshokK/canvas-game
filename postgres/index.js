import { Pool } from 'pg';

let pool = null;

export const configurePool = (config) => {
  pool = new Pool(config);
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
};

export const sqlQuery = async (queryString, values) => {
  if (!pool) {
    console.error("Pool hasn't been configured yet!");
  } else {
    const client = await pool.connect();
    try {
      const results = await client.query(queryString, values);
      return results.rows;
    } catch (e) {
      throw new Error(`Query error: ${e}`);
    } finally {
      client.release();
    }
  }
};
