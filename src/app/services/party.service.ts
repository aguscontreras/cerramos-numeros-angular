import { Injectable } from '@angular/core';
import { PartyLike, StateCrud } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { Party } from '../models';
import { filter } from 'rxjs';

export interface PartyState {
  allParties: PartyLike[];
  currentParty?: PartyLike;
}

const initialState: PartyState = {
  allParties: [],
  currentParty: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class PartyService
  extends DatabaseInteractor<'parties', PartyState>
  implements StateCrud<Party>
{
  allItems$ = this.select(({ allParties }) => allParties);

  selectedItem$ = this.select(({ currentParty }) => currentParty).pipe(
    filter(Boolean)
  );

  constructor() {
    super('parties', initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const allParties = (await this.getAll()) ?? [];
    this.setState({ allParties });
  }

  async selectItem(id: string) {
    const currentParty = await this.get(id);
    this.setState({ currentParty });
  }

  async addItem(party: Party) {
    await this.add(party);
  }

  async updateItem(party: Party) {
    await this.update(party);
  }

  async deleteItem(id: string) {
    this.setState({ allParties: [] });
    await this.delete(id);
  }
}
