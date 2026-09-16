export type ProjectStatus = 'open' | 'closed';

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
}

export interface UpdateProjectRequest {
  status: ProjectStatus;
}

export interface CreateTaskRequest {
  title: string;
}

export type ApiErrorCode =
  | 'INVALID_REQUEST'
  | 'PROJECT_NOT_FOUND'
  | 'PROJECT_NAME_TAKEN'
  | 'PROJECT_CLOSED'
  | 'ROUTE_NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  path: string;
}

export interface ProjectRow {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

export interface TaskRow {
  id: number;
  project_id: number;
  title: string;
  created_at: string;
}
