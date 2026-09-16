import { fileURLToPath } from 'node:url';
import type Database from 'better-sqlite3';
import express from 'express';
import { createProjectRouter } from './controllers/projectController.js';
import { createTaskRouter } from './controllers/taskController.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createProjectRepository } from './repositories/projectRepository.js';
import { createTaskRepository } from './repositories/taskRepository.js';
import { createProjectService } from './services/projectService.js';
import { createTaskService } from './services/taskService.js';

export function createApp(db: Database.Database): express.Express {
  const projects = createProjectRepository(db);
  const tasks = createTaskRepository(db);
  const projectService = createProjectService(projects);
  const taskService = createTaskService(projects, tasks);

  const app = express();

  app.use(express.json());
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));

  app.use('/api/v1/projects', createProjectRouter(projectService));
  app.use('/api/v1/projects', createTaskRouter(taskService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
