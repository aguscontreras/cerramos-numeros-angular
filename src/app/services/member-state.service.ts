import { Injectable } from '@angular/core';
import { Member } from '../models';
import { StateService } from './state.service';
import { MemberService } from './member.service';
import { StateCrud } from '../models/state-crud.model';

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
export class MemberStateService
  extends StateService<MemberState>
  implements StateCrud<Member>
{
  allItems$ = this.select(({ members }) => members);

  selectedItem$ = this.select(({ selectedMember }) => selectedMember);

  constructor(private memberService: MemberService) {
    super(initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const members = (await this.memberService.getAll()) ?? [];
    this.setState({ members });
  }

  async selectItem(id: string) {
    const selectedMember = await this.memberService.get(id);
    this.setState({ selectedMember });
  }

  async addItem(member: Member) {
    await this.memberService.add(member);
    await this.getAllItems();
  }

  async updateItem(id: string, member: Member) {
    await this.memberService.update(id, member);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    await this.memberService.delete(id);
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
}
