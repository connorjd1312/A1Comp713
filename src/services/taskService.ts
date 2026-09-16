import { AppError } from '../errors.js';
import type { ProjectRepository } from '../repositories/projectRepository.js';
import type { TaskRepository } from '../repositories/taskRepository.js';
import type { Task } from '../types.js';

export interface TaskService {
  createTask(projectId: number, body: unknown): Task;
  listTasks(projectId: number): Task[];
}

const TITLE_MESSAGE = 'title must be a string of 1-200 characters.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createTaskService(
  projects: ProjectRepository,
  tasks: TaskRepository,
): TaskService {
  return {
    createTask(projectId: number, body: unknown): Task {
      if (!isRecord(body) || typeof body.title !== 'string') {
        throw new AppError(400, 'INVALID_REQUEST', TITLE_MESSAGE);
      }

      const title = body.title.trim();
      if (title.length < 1 || title.length > 200) {
        throw new AppError(400, 'INVALID_REQUEST', TITLE_MESSAGE);
      }

      const project = projects.findById(projectId);
      if (project === undefined) {
        throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found.');
      }

      if (project.status === 'closed') {
        throw new AppError(409, 'PROJECT_CLOSED', 'Cannot add tasks to a closed project.');
      }

      return tasks.insert(projectId, title);
    },

    listTasks(projectId: number): Task[] {
      if (projects.findById(projectId) === undefined) {
        throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found.');
      }

      return tasks.findByProjectId(projectId);
    },
  };
}
