import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { DB_NAME, LocalDBSchema } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _db?: IDBPDatabase<LocalDBSchema>;

  constructor() {}

  get db() {
    return this._db;
  }

  async awaitForDb() {
    if (!this._db) {
      this._db = await this.initDb();
    }
  }

  async initDb() {
    try {
      const db = await openDB<LocalDBSchema>(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore('members', { keyPath: 'id' }).createIndex(
            'by-name',
            'name'
          );

          db.createObjectStore('categories', { keyPath: 'id' }).createIndex(
            'by-name',
            'name'
          );

          db.createObjectStore('expenses', { keyPath: 'id' }).createIndex(
            'by-amount',
            'amount'
          );
        },
      });

      this._db = db;
      return db;
    } catch (error) {
      window.console.error('[StorageService] Error starting DB.', error);
      throw error;
    }
  }
}
