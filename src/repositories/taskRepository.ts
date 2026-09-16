import type Database from 'better-sqlite3';
import { AppError } from '../errors.js';
import type { Task, TaskRow } from '../types.js';

export interface TaskRepository {
  insert(projectId: number, title: string): Task;
  findByProjectId(projectId: number): Task[];
}

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    createdAt: row.created_at,
  };
}

export function createTaskRepository(db: Database.Database): TaskRepository {
  const insertStatement = db.prepare<[number, string], Database.RunResult>(
    'INSERT INTO tasks (project_id, title) VALUES (?, ?)',
  );
  const findByIdStatement = db.prepare<[number], TaskRow>(
    'SELECT id, project_id, title, created_at FROM tasks WHERE id = ?',
  );
  const findByProjectIdStatement = db.prepare<[number], TaskRow>(
    'SELECT id, project_id, title, created_at FROM tasks WHERE project_id = ? ORDER BY id',
  );

  return {
    insert(projectId: number, title: string): Task {
      const info = insertStatement.run(projectId, title);
      const row = findByIdStatement.get(Number(info.lastInsertRowid));
      if (row === undefined) {
        throw new AppError(500, 'INTERNAL_ERROR', 'Unexpected server error.');
      }
      return toTask(row);
    },

    findByProjectId(projectId: number): Task[] {
      return findByProjectIdStatement.all(projectId).map(toTask);
    },
  };
}
