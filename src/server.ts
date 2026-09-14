import express from 'express';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/projects', tasksRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
