// eslint-disable-next-line import/no-extraneous-dependencies
import { IndexNames, StoreNames } from 'idb';
import { DatabaseService } from './database.service';
import { LocalDBSchema } from '../models';

export class StorageInteractor<Name extends StoreNames<LocalDBSchema>> {
  constructor(
    private storageService: DatabaseService,
    private storeName: Name
  ) {}

  async getAll() {
    await this.storageService.awaitForDb();
    const allItems = this.storageService.db?.getAll(this.storeName);

    return allItems;
  }

  async getAllFromIndex<IndexName extends IndexNames<LocalDBSchema, Name>>(
    indexName: IndexName
  ) {
    await this.storageService.awaitForDb();
    const allItems = await this.storageService.db?.getAllFromIndex(
      this.storeName,
      indexName
    );

    return allItems;
  }

  async get(id: string) {
    await this.storageService.awaitForDb();
    const item = await this.storageService.db?.get(this.storeName, id);

    return item;
  }

  async add(
    item: LocalDBSchema[Name]['value']
  ): Promise<LocalDBSchema[Name]['value']> {
    await this.storageService.awaitForDb();
    await this.storageService.db?.add(this.storeName, item);
    console.log('[Storage interactor] Item added', item);

    return item;
  }

  async update(id: string, item: LocalDBSchema[Name]['value']) {
    await this.storageService.awaitForDb();
    await this.storageService.db?.put(this.storeName, item, id);
    console.log('[Storage interactor] Item updated', item);

    return item;
  }

  async delete(id: string) {
    await this.storageService.awaitForDb();
    await this.storageService.db?.delete(this.storeName, id);
    console.log('[Storage interactor] Item deleted', id);
  }
}
