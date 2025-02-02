import Database from '@tauri-apps/plugin-sql';

export type DatabaseType = Database;

export class DatabaseService {
  db?: DatabaseType;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.db = await Database.load('sqlite:ibis.db');
  }

  public getDb() {
    return this.db;
  }
}

export const db = new DatabaseService();
