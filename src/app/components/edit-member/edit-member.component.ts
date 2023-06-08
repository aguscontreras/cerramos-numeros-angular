import { Component, OnDestroy } from '@angular/core';
import { concatMap, exhaustMap, from, Subscription, take, tap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MemberService } from '../../services/member.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { DELETE_COUNT, EditItemActions, Member } from '../../models';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent implements OnDestroy {
  member: Member;

  deleteCount = DELETE_COUNT;

  deleteSubmitted = false;

  private subscription = new Subscription();

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private memberService: MemberService,
    private customMessageService: CustomMessageService,
    private expenseService: ExpenseService
  ) {
    this.member = this.config.data.member;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (!this.member.name) {
      throw new Error('[Edit member] Member name is empty.');
    }

    const subsc = from(this.saveMember(this.member)).subscribe({
      next: (member) => {
        console.log('[Edit member] Member updated.', member);
        this.customMessageService.showSuccess('¡Excelente!', 'Persona editada');
        this.ref.close(EditItemActions.UPDATE);
      },
      error: (error) => {
        console.error('[Edit member] Error updating member.', error);
        this.customMessageService.showError(
          'Ocurrió un error',
          'Intentá nuevamente'
        );
      },
    });

    this.subscription.add(subsc);
  }

  private async saveMember(member: Member) {
    await this.memberService.updateItem(member.id, member);
    return member;
  }

  validataDeleteCount() {
    this.deleteSubmitted = true;
    --this.deleteCount;

    if (this.deleteCount === 0) {
      this.deleteExpense();
    }
  }

  private deleteExpense() {
    const { id } = this.member;

    const subsc = from(this.expenseService.deleteAllByMemberId(id))
      .pipe(
        take(1),
        concatMap(() => from(this.memberService.deleteItem(id)))
      )
      .subscribe({
        next: () => {
          console.log('[Expense edit] Member deleted.', id);
          this.customMessageService.showSuccess(
            '¡Excelente!',
            'Persona eliminada'
          );
          this.ref.close(EditItemActions.DELETE);
        },
        error: (error) => {
          console.error('[Expense edit] Error deleting member.', error);
          this.customMessageService.showError(
            'Ocurrió un error',
            'Intentá nuevamente'
          );
        },
      });

    this.subscription.add(subsc);
  }
}
