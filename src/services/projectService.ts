import { AppError } from '../errors.js';
import type { ProjectRepository } from '../repositories/projectRepository.js';
import type { Project, ProjectStatus } from '../types.js';

export interface ProjectService {
  createProject(body: unknown): Project;
  listProjects(): Project[];
  updateProject(id: number, body: unknown): Project;
}

const NAME_MESSAGE = 'name must be a string of 1-100 characters.';
const STATUS_MESSAGE = "status must be either 'open' or 'closed'.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createProjectService(projects: ProjectRepository): ProjectService {
  return {
    createProject(body: unknown): Project {
      if (!isRecord(body) || typeof body.name !== 'string') {
        throw new AppError(400, 'INVALID_REQUEST', NAME_MESSAGE);
      }

      const name = body.name.trim();
      if (name.length < 1 || name.length > 100) {
        throw new AppError(400, 'INVALID_REQUEST', NAME_MESSAGE);
      }

      return projects.insert(name);
    },

    listProjects(): Project[] {
      return projects.findAll();
    },

    updateProject(id: number, body: unknown): Project {
      const status = isRecord(body) ? body.status : undefined;
      if (status !== 'open' && status !== 'closed') {
        throw new AppError(400, 'INVALID_REQUEST', STATUS_MESSAGE);
      }

      if (projects.findById(id) === undefined) {
        throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found.');
      }

      return projects.updateStatus(id, status as ProjectStatus);
    },
  };
}
