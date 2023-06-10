// eslint-disable-next-line import/no-extraneous-dependencies
import { IndexNames, StoreNames } from 'idb';
import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { LocalDBSchema } from '../models';

export const STORE_NAME = new InjectionToken<string>('storeName');

@Injectable({ providedIn: 'root' })
export class DatabaseInteractor<Name extends StoreNames<LocalDBSchema>> {
  private databaseService = inject(DatabaseService);

  constructor(@Inject(STORE_NAME) private storeName: Name) {}

  async getAll() {
    await this.databaseService.awaitForDb();
    const allItems = this.databaseService.db?.getAll(this.storeName);

    return allItems;
  }

  async getAllFromIndex<IndexName extends IndexNames<LocalDBSchema, Name>>(
    indexName: IndexName
  ) {
    await this.databaseService.awaitForDb();
    const allItems = await this.databaseService.db?.getAllFromIndex(
      this.storeName,
      indexName
    );

    return allItems;
  }

  async get(id: string) {
    await this.databaseService.awaitForDb();
    const item = await this.databaseService.db?.get(this.storeName, id);

    return item;
  }

  async add(
    item: LocalDBSchema[Name]['value']
  ): Promise<LocalDBSchema[Name]['value']> {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.add(this.storeName, item);

    console.log('[Storage interactor] Item added', item);

    return item;
  }

  async update(item: LocalDBSchema[Name]['value']) {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.put(this.storeName, item);

    console.log('[Storage interactor] Item updated', item);

    return item;
  }

  async delete(id: string) {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.delete(this.storeName, id);

    console.log('[Storage interactor] Item deleted', id);
  }
}
