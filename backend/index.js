import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

// Helper function to parse various date formats
function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const lower = dateStr.toLowerCase();
  
  // Handle "April 2026" format
  for (let i = 0; i < months.length; i++) {
    if (lower.includes(months[i])) {
      const year = parseInt(dateStr.match(/\d{4}/)?.[0] || '2000');
      return new Date(year, i, 1);
    }
  }
  
  // Handle "2025" format
  if (dateStr.match(/^\d{4}$/)) {
    return new Date(parseInt(dateStr), 0, 1);
  }
  
  return new Date(dateStr);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dir1ub2qu',
  api_key: '728214146162598',
  api_secret: 'VQvAj4pfE4oNcPcObbpr-ww_MD0'
});

// Configure multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============ PROFILE ROUTES ============
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile WHERE id = 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile', async (req, res) => {
  try {
    const { name, title, bio, location, email, phone, linkedin, github, avatar_url } = req.body;
    
    const existing = await pool.query('SELECT * FROM profile WHERE id = 1');
    
    if (existing.rows.length === 0) {
      await pool.query(`
        INSERT INTO profile (id, name, title, bio, location, email, phone, linkedin, github, avatar_url)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [name, title, bio, location, email, phone, linkedin, github, avatar_url]);
    } else {
      await pool.query(`
        UPDATE profile SET
          name = $1, title = $2, bio = $3, location = $4,
          email = $5, phone = $6, linkedin = $7, github = $8, avatar_url = $9
        WHERE id = 1
      `, [name, title, bio, location, email, phone, linkedin, github, avatar_url]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EXPERIENCE ROUTES ============
app.get('/api/experience', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience');
    const sorted = result.rows.sort((a, b) => {
      const dateA = parseDate(a.start_date);
      const dateB = parseDate(b.start_date);
      return dateB - dateA;
    });
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experience', async (req, res) => {
  try {
    const { job_title, company, location, start_date, end_date, current, description, highlights } = req.body;
    const result = await pool.query(`
      INSERT INTO experience (job_title, company, location, start_date, end_date, current, description, highlights)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [job_title, company, location, start_date, end_date, current, description, highlights]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { job_title, company, location, start_date, end_date, current, description, highlights } = req.body;
    await pool.query(`
      UPDATE experience SET
        job_title = $1, company = $2, location = $3, start_date = $4,
        end_date = $5, current = $6, description = $7, highlights = $8
      WHERE id = $9
    `, [job_title, company, location, start_date, end_date, current, description, highlights, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM experience WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EDUCATION ROUTES ============
app.get('/api/education', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM education');
    const sorted = result.rows.sort((a, b) => {
      return (parseInt(b.start_year) || 0) - (parseInt(a.start_year) || 0);
    });
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/education', async (req, res) => {
  try {
    const { degree, field, institution, start_year, end_year } = req.body;
    const result = await pool.query(`
      INSERT INTO education (degree, field, institution, start_year, end_year)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [degree, field, institution, start_year, end_year]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/education/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, field, institution, start_year, end_year } = req.body;
    await pool.query(`
      UPDATE education SET
        degree = $1, field = $2, institution = $3, start_year = $4, end_year = $5
      WHERE id = $6
    `, [degree, field, institution, start_year, end_year, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/education/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM education WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SKILLS ROUTES ============
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const result = await pool.query(`
      INSERT INTO skills (name, category, level)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, category, level]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, level } = req.body;
    await pool.query(`
      UPDATE skills SET name = $1, category = $2, level = $3
      WHERE id = $4
    `, [name, category, level, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROJECTS ROUTES ============
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY featured DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, tech_stack, live_url, github_url, image_urls, featured } = req.body;
    const result = await pool.query(`
      INSERT INTO projects (title, description, tech_stack, live_url, github_url, image_urls, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, tech_stack, live_url, github_url, image_urls, featured || false]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, live_url, github_url, image_urls, featured } = req.body;
    await pool.query(`
      UPDATE projects SET
        title = $1, description = $2, tech_stack = $3,
        live_url = $4, github_url = $5, image_urls = $6, featured = $7
      WHERE id = $8
    `, [title, description, tech_stack, live_url, github_url, image_urls, featured || false, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ IMAGE UPLOAD ROUTE ============
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ACHIEVEMENTS ROUTES ============
app.get('/api/achievements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const { title, issuer, date, description, category, url } = req.body;
    const result = await pool.query(`
      INSERT INTO achievements (title, issuer, date, description, category, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, issuer, date, description, category, url]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issuer, date, description, category, url } = req.body;
    await pool.query(`
      UPDATE achievements SET
        title = $1, issuer = $2, date = $3, description = $4, category = $5, url = $6
      WHERE id = $7
    `, [title, issuer, date, description, category, url, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM achievements WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RESUME DATA ROUTE ============
app.get('/api/resume/data', async (req, res) => {
  try {
    const profile = await pool.query('SELECT * FROM profile WHERE id = 1');
    
    const experienceResult = await pool.query('SELECT * FROM experience');
    const experience = experienceResult.rows.sort((a, b) => {
      const dateA = parseDate(a.start_date);
      const dateB = parseDate(b.start_date);
      return dateB - dateA;
    });
    
    const educationResult = await pool.query('SELECT * FROM education');
    const education = educationResult.rows.sort((a, b) => {
      return (parseInt(b.start_year) || 0) - (parseInt(a.start_year) || 0);
    });
    
    const skills = await pool.query('SELECT * FROM skills ORDER BY category ASC');
    const projects = await pool.query('SELECT * FROM projects ORDER BY featured DESC');
    const achievements = await pool.query('SELECT * FROM achievements ORDER BY date DESC');
    
    res.json({
      profile: profile.rows[0] || {},
      experience: experience,
      education: education,
      skills: skills.rows,
      projects: projects.rows,
      achievements: achievements.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});