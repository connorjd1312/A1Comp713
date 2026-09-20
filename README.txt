PROJECT TRACKER
===============

A simple web app for tracking projects and their tasks.

- Frontend: plain HTML/JS pages
- Backend: Express API
- Database: SQLite (single file, no server to install)

Each project has a name and a status (open or closed). Each task has a
title and belongs to one project. Closed projects can't get new tasks.


WHAT YOU NEED
-------------
- Node.js 22 or newer (includes npm)

That's it - no database server, no Docker, nothing else to install.


SETUP
-----
1. git clone <repository-url>
2. cd project-tracker
3. npm install

Windows PowerShell users: if you get an error about "running scripts is
disabled", either:
  - run "npm.cmd install" instead of "npm install", or
  - run this once: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  - or just use Command Prompt or Git Bash instead of PowerShell


RUNNING IT
----------
Development mode (restarts automatically when you edit files):
  npm run dev

Or build and run normally:
  npm run build
  npm start

Then open http://localhost:3000 in your browser.


SETTINGS (OPTIONAL)
--------------------
No setup needed to run it - these are only if you want to change the
defaults. Copy .env.example to .env and edit it:

  PORT            default 3000            which port the server runs on
  DATABASE_PATH   default ./data/app.db   where the SQLite file is saved


USING IT
--------
- Homepage: see all projects, add a new one, open/close a project
- Click a project: see its tasks, add a new task
- Errors show up on the page as "CODE: message"


API (FOR DEVELOPERS)
---------------------
Base path: /api/v1

  Create a project     POST /projects              body: {"name": "..."}
  List projects         GET  /projects
  Open/close a project  PATCH /projects/:id         body: {"status": "open" or "closed"}
  Add a task            POST /projects/:id/tasks    body: {"title": "..."}
  List tasks             GET  /projects/:id/tasks


RUNNING THE TESTS
------------------
  npm test


PROJECT LAYOUT
---------------
  src/controllers/   API routes
  src/services/      business rules (e.g. no tasks on closed projects)
  src/repositories/  database queries
  src/middleware/    error handling
  public/            the web pages
  db/                database schema
  test/              tests


KNOWN LIMITS
------------
- No login/authentication
- Single SQLite file - not built to scale across servers
- Can't edit or delete tasks yet
- No pagination on lists
