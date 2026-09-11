'use strict';

async function loadProjects() {
  const res = await fetch('/api/v1/projects');
  const projects = await res.json();

  const list = document.getElementById('projects');
  list.innerHTML = '';
  projects.forEach(function (project) {
    const item = document.createElement('li');
    item.textContent = project.name;
    list.appendChild(item);
  });
}

document.getElementById('create-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const input = document.getElementById('name');

  await fetch('/api/v1/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: input.value })
  });

  input.value = '';
  loadProjects();
});

loadProjects();
