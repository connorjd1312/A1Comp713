'use strict';

async function request(method, url, body) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const payload = await res.json().catch(function () { return null; });

  if (!res.ok) {
    // The server just sends { error: "..." } right now - no error code yet.
    throw new Error((payload && payload.error) || res.statusText);
  }

  return payload;
}

function showError(err) {
  document.getElementById('error').textContent = err.message;
}

// --- index.html -------------------------------------------------------------

async function loadProjects() {
  const projects = await request('GET', '/api/v1/projects');
  const list = document.getElementById('projects');
  list.innerHTML = '';

  projects.forEach(function (project) {
    const item = document.createElement('li');

    const link = document.createElement('a');
    link.href = `project.html?projectId=${project.id}`;
    link.textContent = `${project.name} (${project.status})`;
    item.appendChild(link);

    list.appendChild(item);
  });
}

function initIndexPage() {
  document.getElementById('create-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const input = document.getElementById('name');
    try {
      await request('POST', '/api/v1/projects', { name: input.value });
      input.value = '';
      await loadProjects();
    } catch (err) {
      showError(err);
    }
  });

  loadProjects();
}

// --- project.html -----------------------------------------------------------

async function loadTasks(projectId) {
  const tasks = await request('GET', `/api/v1/projects/${projectId}/tasks`);
  const list = document.getElementById('tasks');
  list.innerHTML = '';

  tasks.forEach(function (task) {
    const item = document.createElement('li');
    item.textContent = task.title;
    list.appendChild(item);
  });
}

function initProjectPage() {
  const projectId = new URLSearchParams(location.search).get('projectId');
  document.getElementById('project-title').textContent = `Project #${projectId}`;

  document.getElementById('task-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const input = document.getElementById('title');
    try {
      await request('POST', `/api/v1/projects/${projectId}/tasks`, { title: input.value });
      input.value = '';
      await loadTasks(projectId);
    } catch (err) {
      showError(err);
    }
  });

  loadTasks(projectId);
}

// --- bootstrap --------------------------------------------------------------

if (document.body.dataset.page === 'index') {
  initIndexPage();
} else if (document.body.dataset.page === 'project') {
  initProjectPage();
}
