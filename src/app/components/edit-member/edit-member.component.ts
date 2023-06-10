import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MemberService } from '../../services/member.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { ExpenseService } from '../../services/expense.service';
import { DELETE_COUNT, EditItemActions, Member } from '../../models';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent {
  member: Member;

  deleteCount = DELETE_COUNT;

  deleteSubmitted = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private memberService: MemberService,
    private customMessageService: CustomMessageService,
    private expenseService: ExpenseService
  ) {
    this.member = this.config.data.member;
  }

  async onSubmit() {
    if (!this.member.name) {
      throw new Error('[Edit member] Member name is empty.');
    }

    try {
      const member = await this.saveMember(this.member);
      console.log('[Edit member] Member updated.', member);
      this.customMessageService.showSuccess('¡Excelente!', 'Persona editada');
      this.ref.close(EditItemActions.UPDATE);
    } catch (error) {
      console.error('[Edit member] Error updating member.', error);
      this.customMessageService.showError(
        'Ocurrió un error',
        'Intentá nuevamente'
      );
    }
  }

  private async saveMember(member: Member) {
    await Promise.all([
      this.memberService.updateItem(member),
      this.memberService.getAllItems(),
    ]);

    return member;
  }

  validataDeleteCount() {
    this.deleteSubmitted = true;
    --this.deleteCount;

    if (this.deleteCount === 0) {
      this.deleteExpense();
    }
  }

  private async deleteExpense() {
    const { id } = this.member;

    try {
      await Promise.all([
        this.expenseService.deleteAllByMemberId(id),
        this.memberService.deleteItem(id),
        this.expenseService.getAllItems(),
        this.memberService.getAllItems(),
      ]);

      console.log('[Expense edit] Member deleted.', id);
      this.customMessageService.showSuccess('¡Excelente!', 'Persona eliminada');
      this.ref.close(EditItemActions.DELETE);
    } catch (error) {
      console.error('[Expense edit] Error deleting member.', error);
      this.customMessageService.showError(
        'Ocurrió un error',
        'Intentá nuevamente'
      );
    }
  }
}
