import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Nothing is saved to disk yet - projects just live in memory until the
// server restarts. Good enough to get the API shape working first.
const projects: { id: number; name: string }[] = [];
let nextId = 1;

app.post('/api/v1/projects', (req, res) => {
  const project = { id: nextId++, name: req.body.name };
  projects.push(project);
  res.status(201).json(project);
});

app.get('/api/v1/projects', (req, res) => {
  res.json(projects);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
