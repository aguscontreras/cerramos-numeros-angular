import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  from,
  exhaustMap,
  Observable,
  of,
  combineLatest,
  filter,
  switchMap,
  take,
  Subscription,
} from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseService } from '../../services/expense.service';
import { MemberService } from '../../services/member.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { CategoryService } from '../../services/category.service';
import {
  Category,
  DELETE_COUNT,
  DetailedExpense,
  EditItemActions,
  Expense,
  Member,
  PartyLike,
} from '../../models';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss'],
})
export class ExpenseEditComponent implements OnInit, OnDestroy {
  form: FormGroup;

  deleteCount = DELETE_COUNT;

  deleteSubmitted = false;

  private expense: DetailedExpense;

  private currentParty$: Observable<PartyLike>;

  private selectedMember$: Observable<Member | undefined>;

  private selectedCategory$: Observable<Category | undefined>;

  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private partyService: PartyService,
    private memberService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private customMessageService: CustomMessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.form = this.createForm();
    this.expense = this.config.data.expense;
    this.currentParty$ = this.partyService.selectedItem$.pipe(filter(Boolean));
    this.selectedMember$ = this.memberService.selectedItem$;
    this.selectedCategory$ = this.categoryService.selectedItem$;
  }

  ngOnInit() {
    if (this.expense) this.setFormData(this.expense);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    return this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      member: ['', Validators.required],
      category: [null],
    });
  }

  setFormData(expense: DetailedExpense) {
    this.form.patchValue({
      amount: expense.amount,
      member: expense.member,
      category: expense.category,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      throw new Error('[Add member] Invalid form.', this.form.value);
    }

    this.updateExpense();
  }

  private async updateExpense() {
    const { member, amount, category } = this.form.value;

    const subsc = combineLatest([
      this.currentParty$,
      this.validateMember$(member),
      this.validateCategory$(category),
    ])
      .pipe(
        switchMap(([currentParty, selectedMember, selectedCategory]) =>
          from(
            this.saveExpense(
              amount,
              currentParty,
              selectedMember,
              selectedCategory
            )
          )
        )
      )
      .subscribe({
        next: (expense) => {
          console.log('[Expense edit] Expense updated.', expense);
          this.customMessageService.showSuccess('¡Excelente!', 'Gasto editado');
          this.ref.close(EditItemActions.UPDATE);
        },
        error: (error) => {
          console.error('[Expense edit] Error updating expense.', error);
          this.customMessageService.showError(
            'Ocurrió un error',
            'Intentá nuevamente'
          );
        },
      });

    this.subscription.add(subsc);
  }

  private async saveExpense(
    amount: number,
    party: PartyLike,
    member: Member,
    category?: Category
  ) {
    const expense: Expense = {
      ...this.expense,
      amount,
      partyId: party.id,
      memberId: member.id,
      categoryId: category?.id,
    };

    await Promise.all([
      this.expenseService.updateItem(expense),
      this.expenseService.getAllItems(),
    ]);

    return expense;
  }

  private validateMember$(member: string | Member) {
    return from(this.memberService.validate(member)).pipe(
      exhaustMap(() => this.selectedMember$.pipe(take(1), filter(Boolean)))
    );
  }

  private validateCategory$(category?: string | Category) {
    if (!category) {
      return of(undefined);
    }

    return from(this.categoryService.validateCategory(category)).pipe(
      exhaustMap(() => this.selectedCategory$.pipe(take(1), filter(Boolean)))
    );
  }

  validataDeleteCount() {
    this.deleteSubmitted = true;
    --this.deleteCount;

    if (this.deleteCount === 0) {
      this.deleteExpense();
    }
  }

  private async deleteExpense() {
    const { id } = this.expense;

    try {
      await Promise.all([
        this.expenseService.deleteItem(id),
        this.expenseService.getAllItems(),
      ]);

      console.log('[Expense edit] Expense deleted.', id);
      this.customMessageService.showSuccess('¡Excelente!', 'Gasto eliminado');
      this.ref.close(EditItemActions.DELETE);
    } catch (error) {
      console.error('[Expense edit] Error deleting expense.', error);
      this.customMessageService.showError(
        'Ocurrió un error',
        'Intentá nuevamente'
      );
    }
  }
}
