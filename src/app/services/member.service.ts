import { Injectable } from '@angular/core';
import { Member, StateCrud, StateStoreModel } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { StateService } from './state.service';

type MemberState = StateStoreModel<Member>;

const initialState: MemberState = {
  allItems: [],
};

@Injectable({
  providedIn: 'root',
})
export class MemberService
  extends StateService<MemberState>
  implements StateCrud<Member>
{
  allItems$ = this.select(({ allItems }) => allItems);

  selectedItem$ = this.select(({ selectedItem }) => selectedItem);

  constructor(private interactor: DatabaseInteractor<'members'>) {
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

  async add(member: Member) {
    await this.interactor.add(member);
  }

  async update(member: Member) {
    await this.interactor.update(member);
  }

  async delete(id: string) {
    await this.interactor.delete(id);
  }

  async validate(member: string | Member) {
    if (typeof member === 'string') {
      console.log('[Member state service] New Member should be added');
      const newMember = new Member(member);
      await this.add(newMember);
      await this.selectItem(newMember.id);
      return;
    } else {
      await this.selectItem(member.id);
    }
  }

  reverseAllItems() {
    const allItems = [...this.state.allItems];
    this.setState({ allItems: allItems.reverse() });
  }
}
