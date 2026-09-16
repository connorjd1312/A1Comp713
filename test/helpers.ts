import type { Express } from 'express';
import { createApp } from '../src/app.js';
import { openDatabase } from '../src/db.js';

/** A fresh app backed by a new in-memory database, for one test. */
export function newApp(): Express {
  return createApp(openDatabase(':memory:'));
}
