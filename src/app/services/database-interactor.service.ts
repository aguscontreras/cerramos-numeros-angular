// eslint-disable-next-line import/no-extraneous-dependencies
import { IndexNames, StoreNames } from 'idb';
import { DatabaseService } from './database.service';
import { LocalDBSchema } from '../models';
import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { StateService } from './state.service';

const STORE_NAME = new InjectionToken('storeName');
const STATE_SCHEMA = new InjectionToken('storeName');

@Injectable({ providedIn: 'root' })
export class DatabaseInteractor<
  Name extends StoreNames<LocalDBSchema>,
  StateSchema
> extends StateService<StateSchema> {
  private databaseService = inject(DatabaseService);

  constructor(
    @Inject(STORE_NAME) private storeName: Name,
    @Inject(STATE_SCHEMA) private stateSchema: StateSchema
  ) {
    super(stateSchema);
  }

  protected async getAll() {
    await this.databaseService.awaitForDb();
    const allItems = this.databaseService.db?.getAll(this.storeName);

    return allItems;
  }

  protected async getAllFromIndex<
    IndexName extends IndexNames<LocalDBSchema, Name>
  >(indexName: IndexName) {
    await this.databaseService.awaitForDb();
    const allItems = await this.databaseService.db?.getAllFromIndex(
      this.storeName,
      indexName
    );

    return allItems;
  }

  protected async get(id: string) {
    await this.databaseService.awaitForDb();
    const item = await this.databaseService.db?.get(this.storeName, id);

    return item;
  }

  protected async add(
    item: LocalDBSchema[Name]['value']
  ): Promise<LocalDBSchema[Name]['value']> {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.add(this.storeName, item);
    console.log('[Storage interactor] Item added', item);

    return item;
  }

  protected async update(id: string, item: LocalDBSchema[Name]['value']) {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.put(this.storeName, item, id);
    console.log('[Storage interactor] Item updated', item);

    return item;
  }

  protected async delete(id: string) {
    await this.databaseService.awaitForDb();
    await this.databaseService.db?.delete(this.storeName, id);
    console.log('[Storage interactor] Item deleted', id);
  }
}
