import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exhaustMap, from, take, throwError } from 'rxjs';
import { ExpenseService } from '../../services/expense.service';
import { AutocompleteMemberDirective } from '../../modules/shared/directives/autocomplete-member.directive';
import { AutocompleteCategoryDirective } from '../../modules/shared/directives/autocomplete-category.directive';
import { CustomMessageService } from '../../services/custom-message.service';
import { MemberStateService } from '../../services/member-state.service';
import { Expense, Member } from '../../models';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent {
  form: FormGroup;

  @ViewChild('memberInput', { read: AutocompleteMemberDirective })
  memberInput?: AutocompleteMemberDirective;

  @ViewChild('categoryInput', { read: AutocompleteCategoryDirective })
  categoryInput?: AutocompleteCategoryDirective;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberStateService,
    private expenseService: ExpenseService,
    private customMessageService: CustomMessageService
  ) {
    this.form = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      member: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  resetForm(): void {
    this.form.reset({
      member: '',
      amount: 0,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      throw new Error('[Add member] Invalid form.', this.form.value);
    }

    this.addMember();
  }

  private async addMember() {
    const { member, amount } = this.form.value;

    from(this.memberService.validateMember(member))
      .pipe(
        exhaustMap(() => this.memberService.selectedItem$.pipe(take(1))),
        exhaustMap((selectedMember) =>
          selectedMember
            ? from(this.saveExpense(amount, selectedMember))
            : throwError(() => new Error('Member not found.'))
        )
      )
      .subscribe({
        next: (expense) => {
          console.log('[Add member] Expense added.', expense);
          this.customMessageService.showSuccess('Excelente!', 'Item creado');
        },
        error: (error) => {
          console.error('[Add member] Error creating expense.', error);
          this.customMessageService.showError(
            'Ocurrió un error',
            'Intentá nuevamente'
          );
        },
        complete: () => this.resetForm(),
      });
  }

  private async saveExpense(amount: number, member: Member) {
    const expense = new Expense(amount, member.id);
    await this.expenseService.add(expense);
    return expense;
  }
}
