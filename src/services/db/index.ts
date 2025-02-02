import Database from "@tauri-apps/plugin-sql";

class DatabaseService {
  private db: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.db = await Database.load("sqlite:ibis.db");
  }

  public getDb() {
    return this.db;
  }
}

export const db = new DatabaseService();
