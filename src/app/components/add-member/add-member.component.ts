import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exhaustMap, from, take, throwError } from 'rxjs';
import { AutocompleteMemberDirective } from '../../modules/shared/directives/autocomplete-member.directive';
import { AutocompleteCategoryDirective } from '../../modules/shared/directives/autocomplete-category.directive';
import { ExpenseStateService } from '../../services/expense-state.service';
import { MemberStateService } from '../../services/member-state.service';
import { CustomMessageService } from '../../services/custom-message.service';
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

  selectedMember$ = this.memberStateService.selectedItem$;

  expenses$ = this.expenseStateService.allItems$;

  constructor(
    private formBuilder: FormBuilder,
    private memberStateService: MemberStateService,
    private expenseStateService: ExpenseStateService,
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

  calculate() {}

  private async addMember() {
    const { member, amount } = this.form.value;

    from(this.memberStateService.validateMember(member))
      .pipe(
        exhaustMap(() => this.selectedMember$.pipe(take(1))),
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
    await this.expenseStateService.addItem(expense);
    return expense;
  }
}
