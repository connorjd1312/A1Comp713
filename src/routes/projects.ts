import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }

  const info = db.prepare('INSERT INTO projects (name) VALUES (?)').run(name);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(project);
});

router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects').all();
  res.json(projects);
});

router.patch('/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE projects SET status = ? WHERE id = ?').run(status, req.params.id);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(project);
});

export default router;
