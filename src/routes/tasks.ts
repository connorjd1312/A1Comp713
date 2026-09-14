import express from 'express';
import db from '../db.js';

const router = express.Router();

// TODO: a closed project should not be able to accept new tasks.
router.post('/:projectId/tasks', (req, res) => {
  const title = req.body.title;
  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const info = db
    .prepare('INSERT INTO tasks (project_id, title) VALUES (?, ?)')
    .run(req.params.projectId, title);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(task);
});

router.get('/:projectId/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ?').all(req.params.projectId);
  res.json(tasks);
});

export default router;
