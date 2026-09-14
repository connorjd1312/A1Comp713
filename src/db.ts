import { readFileSync } from 'node:fs';
import Database from 'better-sqlite3';

const db = new Database('./data/app.db');
db.exec(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));

export default db;
