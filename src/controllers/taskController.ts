import express, { type NextFunction, type Request, type Response } from 'express';
import type { TaskService } from '../services/taskService.js';
import { parseId } from './projectController.js';

export function createTaskRouter(service: TaskService): express.Router {
  const router = express.Router();

  router.post('/:projectId/tasks', (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = parseId(req.params.projectId);
      const task = service.createTask(projectId, req.body);
      res.status(201).location(`/api/v1/tasks/${task.id}`).json(task);
    } catch (e) {
      next(e);
    }
  });

  router.get('/:projectId/tasks', (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = parseId(req.params.projectId);
      res.status(200).json(service.listTasks(projectId));
    } catch (e) {
      next(e);
    }
  });

  return router;
}
