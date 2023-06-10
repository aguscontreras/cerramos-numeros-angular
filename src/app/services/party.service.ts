import { Inject, Injectable, InjectionToken } from '@angular/core';
import { PartyLike, StateCrud, StateStoreModel } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { Party } from '../models';
import { filter } from 'rxjs';
import { StateService } from './state.service';

type PartyState = StateStoreModel<PartyLike>;

const initialState: PartyState = {
  allItems: [],
};

const INTERACTOR_PARTIES = new InjectionToken('interactor', {
  providedIn: 'root',
  factory: () => new DatabaseInteractor('parties'),
});

@Injectable({
  providedIn: 'root',
})
export class PartyService
  extends StateService<PartyState>
  implements StateCrud<Party>
{
  allItems$ = this.select(({ allItems }) => allItems);

  selectedItem$ = this.select(({ selectedItem }) => selectedItem).pipe(
    filter(Boolean)
  );

  constructor(
    @Inject(INTERACTOR_PARTIES)
    private interactor: DatabaseInteractor<'parties'>
  ) {
    super(initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const allItems = (await this.interactor.getAll()) ?? [];
    this.setState({ allItems });
  }

  async selectItem(id: string) {
    const selectedItem = await this.interactor.get(id);
    this.setState({ selectedItem });
  }

  async add(party: Party) {
    await this.interactor.add(party);
  }

  async update(party: Party) {
    await this.interactor.update(party);
  }

  async delete(id: string) {
    this.setState({ allItems: [] });
    await this.interactor.delete(id);
  }
}
