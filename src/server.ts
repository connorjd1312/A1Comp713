import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { openDatabase } from './db.js';

const config = loadConfig();
const db = openDatabase(config.databasePath);
const app = createApp(db);

app.listen(config.port, () => {
  console.log(`Project Tracker listening on http://localhost:${config.port}`);
});
