/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { DB_NAME, LocalDBSchema } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _db?: IDBPDatabase<LocalDBSchema>;

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
      const idpDatabase = await openDB<LocalDBSchema>(DB_NAME, 1, {
        upgrade(db) {
          const partyStore = db.createObjectStore('parties', { keyPath: 'id' });

          const membersStore = db.createObjectStore('members', {
            keyPath: 'id',
          });

          const categoriesStore = db.createObjectStore('categories', {
            keyPath: 'id',
          });

          const expensesStore = db.createObjectStore('expenses', {
            keyPath: 'id',
          });

          partyStore.createIndex('by-name', 'name');
          membersStore.createIndex('by-name', 'name');
          categoriesStore.createIndex('by-name', 'name');
          expensesStore.createIndex('by-amount', 'amount');
          expensesStore.createIndex('by-member-id', 'memberId');
        },
      });

      this._db = idpDatabase;
      return idpDatabase;
    } catch (error) {
      window.console.error('[StorageService] Error starting DB.', error);
      throw error;
    }
  }
}
