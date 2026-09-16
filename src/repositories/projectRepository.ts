import type Database from 'better-sqlite3';
import { AppError } from '../errors.js';
import type { Project, ProjectRow, ProjectStatus } from '../types.js';

export interface ProjectRepository {
  insert(name: string): Project;
  findById(id: number): Project | undefined;
  findAll(): Project[];
  updateStatus(id: number, status: ProjectStatus): Project;
}

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    status: row.status as ProjectStatus,
    createdAt: row.created_at,
  };
}

export function createProjectRepository(db: Database.Database): ProjectRepository {
  const insertStatement = db.prepare<[string], Database.RunResult>(
    'INSERT INTO projects (name) VALUES (?)',
  );
  const findByIdStatement = db.prepare<[number], ProjectRow>(
    'SELECT id, name, status, created_at FROM projects WHERE id = ?',
  );
  const findAllStatement = db.prepare<[], ProjectRow>(
    'SELECT id, name, status, created_at FROM projects ORDER BY id',
  );
  const updateStatusStatement = db.prepare<[string, number]>(
    'UPDATE projects SET status = ? WHERE id = ?',
  );

  function requireById(id: number): Project {
    const row = findByIdStatement.get(id);
    if (row === undefined) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found.');
    }
    return toProject(row);
  }

  return {
    insert(name: string): Project {
      let info: Database.RunResult;
      try {
        info = insertStatement.run(name);
      } catch (e) {
        if (e instanceof Error && (e as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE') {
          throw new AppError(409, 'PROJECT_NAME_TAKEN', 'A project with that name already exists.');
        }
        throw e;
      }

      return requireById(Number(info.lastInsertRowid));
    },

    findById(id: number): Project | undefined {
      const row = findByIdStatement.get(id);
      return row === undefined ? undefined : toProject(row);
    },

    findAll(): Project[] {
      return findAllStatement.all().map(toProject);
    },

    updateStatus(id: number, status: ProjectStatus): Project {
      updateStatusStatement.run(status, id);
      return requireById(id);
    },
  };
}
