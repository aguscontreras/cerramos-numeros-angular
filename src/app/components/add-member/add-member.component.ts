import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, exhaustMap, from, take, throwError } from 'rxjs';
import { AutocompleteMemberDirective } from '../../modules/shared/directives/autocomplete-member.directive';
import { AutocompleteCategoryDirective } from '../../modules/shared/directives/autocomplete-category.directive';
import { ExpenseService } from '../../services/expense.service';
import { MemberService } from '../../services/member.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { PartyService } from '../../services/party.service';
import { Expense, Member, Party } from '../../models';

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

  currentParty$ = this.partyService.selectedItem$;

  selectedMember$ = this.memberService.selectedItem$;

  expenses$ = this.expenseService.allItems$;

  constructor(
    private formBuilder: FormBuilder,
    private partyService: PartyService,
    private memberService: MemberService,
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

  resetForm() {
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

  private addMember() {
    const { member, amount } = this.form.value;

    const currentParty$ = this.currentParty$.pipe(take(1));
    const selectedMember$ = this.selectedMember$.pipe(take(1));

    from(this.memberService.validate(member))
      .pipe(
        exhaustMap(() => combineLatest([currentParty$, selectedMember$])),
        exhaustMap(([currentParty, selectedMember]) =>
          selectedMember && currentParty
            ? from(this.saveExpense(amount, currentParty, selectedMember))
            : throwError(() => new Error('Party or Member not found.'))
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

  private async saveExpense(amount: number, party: Party, member: Member) {
    const expense = new Expense(party.id, amount, member.id);

    await Promise.all([
      this.expenseService.addItem(expense),
      this.expenseService.getAllItems(),
    ]);

    return expense;
  }
}
