import express, { type NextFunction, type Request, type Response } from 'express';
import { AppError } from '../errors.js';
import type { ProjectService } from '../services/projectService.js';

export function parseId(raw: unknown): number {
  if (typeof raw !== 'string' || !/^[1-9][0-9]*$/.test(raw)) {
    throw new AppError(400, 'INVALID_REQUEST', 'projectId must be a positive integer.');
  }

  return Number(raw);
}

export function createProjectRouter(service: ProjectService): express.Router {
  const router = express.Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = service.createProject(req.body);
      res.status(201).location(`/api/v1/projects/${project.id}`).json(project);
    } catch (e) {
      next(e);
    }
  });

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(service.listProjects());
    } catch (e) {
      next(e);
    }
  });

  router.patch('/:projectId', (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = parseId(req.params.projectId);
      const project = service.updateProject(projectId, req.body);
      res.status(200).json(project);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
