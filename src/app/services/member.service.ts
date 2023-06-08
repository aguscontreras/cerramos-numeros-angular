import { Injectable } from '@angular/core';
import { Member } from '../models';
import { StateCrud } from '../models/state-crud.model';
import { DatabaseInteractor } from './database-interactor.service';

interface MemberState {
  members: Member[];
  selectedMember?: Member;
}

const initialState: MemberState = {
  members: [],
};

@Injectable({
  providedIn: 'root',
})
export class MemberService
  extends DatabaseInteractor<'members', MemberState>
  implements StateCrud<Member>
{
  allItems$ = this.select(({ members }) => members);

  selectedItem$ = this.select(({ selectedMember }) => selectedMember);

  constructor() {
    super('members', initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const members = (await this.getAll()) ?? [];
    this.setState({ members });
  }

  async selectItem(id: string) {
    const selectedMember = await this.get(id);
    this.setState({ selectedMember });
  }

  async addItem(member: Member) {
    await this.add(member);
    await this.getAllItems();
  }

  async updateItem(id: string, member: Member) {
    await this.update(id, member);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    this.setState({ members: [] });
    await this.delete(id);
    await this.getAllItems();
  }

  async validateMember(member: string | Member) {
    if (typeof member === 'string') {
      console.log('[Member state service] New Member should be added');
      const newMember = new Member(member);
      await this.addItem(newMember);
      await this.selectItem(newMember.id);
      return;
    } else {
      await this.selectItem(member.id);
    }
  }

  reverseAllItems() {
    const allItems = [...this.state.members];
    this.setState({ members: allItems.reverse() });
  }
}
