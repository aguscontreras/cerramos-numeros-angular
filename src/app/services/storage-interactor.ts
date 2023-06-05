import { StorageService } from './storage.service';
import { LocalDBSchema } from '../models';
import { StoreNames } from 'idb';

export class StorageInteractor<N extends StoreNames<LocalDBSchema>> {
  constructor(private storageService: StorageService, private storeKey: N) {}

  async getAll() {
    await this.storageService.awaitForDb();
    const allItems = this.storageService.db?.getAll(this.storeKey);

    return allItems;
  }

  async get(id: string) {
    await this.storageService.awaitForDb();
    const item = await this.storageService.db?.get(this.storeKey, id);

    return item;
  }

  async add(
    item: LocalDBSchema[N]['value']
  ): Promise<LocalDBSchema[N]['value']> {
    await this.storageService.awaitForDb();
    await this.storageService.db?.add(this.storeKey, item);
    console.log('[Storage interactor] Item added', item);

    return item;
  }

  async update(id: string, item: LocalDBSchema[N]['value']) {
    await this.storageService.awaitForDb();
    await this.storageService.db?.put(this.storeKey, item, id);
    console.log('[Storage interactor] Item updated', item);

    return item;
  }

  async delete(id: string) {
    await this.storageService.awaitForDb();
    await this.storageService.db?.delete(this.storeKey, id);
    console.log('[Storage interactor] Item deleted', id);
  }
}
