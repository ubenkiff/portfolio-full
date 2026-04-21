import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        name TEXT,
        title TEXT,
        bio TEXT,
        location TEXT,
        email TEXT,
        phone TEXT,
        linkedin TEXT,
        github TEXT,
        avatar_url TEXT,
        CONSTRAINT single_row CHECK (id = 1)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        job_title TEXT,
        company TEXT,
        location TEXT,
        start_date TEXT,
        end_date TEXT,
        current BOOLEAN DEFAULT FALSE,
        description TEXT,
        highlights TEXT[],
        sort_order INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree TEXT,
        field TEXT,
        institution TEXT,
        start_year TEXT,
        end_year TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT,
        category TEXT,
        level TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        tech_stack TEXT[],
        live_url TEXT,
        github_url TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title TEXT,
        issuer TEXT,
        date TEXT,
        description TEXT,
        category TEXT,
        url TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    console.log('✅ Database tables ready');
  } catch (error) {
    console.error('Database init error:', error);
  } finally {
    client.release();
  }
}

initDatabase();

export default pool;