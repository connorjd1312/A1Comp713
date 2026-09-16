'use strict';

// Shared fetch helper for the Project Tracker pages. Classic script: no modules.

async function request(method, url, body) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const text = await response.text();

  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (response.ok) {
    return payload;
  }

  const error = new Error((payload && payload.message) || response.statusText);
  error.code = (payload && payload.code) || 'HTTP_' + response.status;
  error.status = response.status;
  throw error;
}

function showError(err) {
  const el = document.getElementById('error');
  if (el) {
    el.textContent = `${err.code || 'ERROR'}: ${err.message}`;
  }
}

function clearError() {
  const el = document.getElementById('error');
  if (el) {
    el.textContent = '';
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

// --- index.html -------------------------------------------------------------

async function loadProjects() {
  clearError();
  const list = document.getElementById('projects');
  try {
    const projects = await request('GET', '/api/v1/projects');
    list.innerHTML = '';

    projects.forEach(function (project) {
      const row = el('li');

      const link = el('a');
      link.href = `project.html?projectId=${project.id}`;
      link.textContent = project.name;

      const info = el('span');
      info.appendChild(link);
      info.appendChild(el('span', 'status', ` (${project.status})`));

      const toggle = el('button', null, project.status === 'open' ? 'Close' : 'Reopen');
      toggle.type = 'button';
      toggle.addEventListener('click', async function () {
        clearError();
        try {
          await request('PATCH', `/api/v1/projects/${project.id}`, {
            status: project.status === 'open' ? 'closed' : 'open'
          });
          await loadProjects();
        } catch (err) {
          showError(err);
        }
      });

      row.appendChild(info);
      row.appendChild(toggle);
      list.appendChild(row);
    });
  } catch (err) {
    showError(err);
  }
}

function initIndexPage() {
  const form = document.getElementById('create-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearError();

    const input = document.getElementById('name');
    const name = input.value;
    if (!name.trim()) {
      return;
    }

    try {
      await request('POST', '/api/v1/projects', { name: name });
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
  clearError();
  const list = document.getElementById('tasks');
  try {
    const tasks = await request('GET', `/api/v1/projects/${projectId}/tasks`);
    list.innerHTML = '';

    tasks.forEach(function (task) {
      const row = el('li');
      row.appendChild(el('span', null, task.title));
      list.appendChild(row);
    });
  } catch (err) {
    showError(err);
  }
}

function initProjectPage() {
  const projectId = new URLSearchParams(location.search).get('projectId');
  document.getElementById('project-title').textContent = `Project #${projectId}`;

  const form = document.getElementById('task-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearError();

    const input = document.getElementById('title');
    const title = input.value;
    if (!title.trim()) {
      return;
    }

    try {
      await request('POST', `/api/v1/projects/${projectId}/tasks`, { title: title });
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
