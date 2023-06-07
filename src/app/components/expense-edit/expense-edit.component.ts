import { Component, OnInit } from '@angular/core';
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
} from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseService } from '../../services/expense.service';
import { MemberService } from '../../services/member.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { CategoryService } from '../../services/category.service';
import { Category, DetailedExpense, Expense, Member } from '../../models';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss'],
})
export class ExpenseEditComponent implements OnInit {
  form: FormGroup;

  private expense: DetailedExpense;

  private selectedMember$: Observable<Member | undefined>;

  private selectedCategory$: Observable<Category | undefined>;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private customMessageService: CustomMessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.form = this.createForm();
    this.expense = this.config.data.expense;
    this.selectedMember$ = this.memberService.selectedItem$;
    this.selectedCategory$ = this.categoryService.selectedItem$;
  }

  ngOnInit() {
    if (this.expense) this.setFormData(this.expense);
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

    combineLatest([
      this.validateMember$(member),
      this.validateCategory$(category),
    ])
      .pipe(
        switchMap(([selectedMember, selectedCategory]) =>
          from(this.saveExpense(amount, selectedMember, selectedCategory))
        )
      )
      .subscribe({
        next: (expense) => {
          console.log('[Expense edit] Expense updated.', expense);
          this.customMessageService.showSuccess('¡Excelente!', 'Gasto editado');
          this.ref.close(true);
        },
        error: (error) => {
          console.error('[Expense edit] Error updating expense.', error);
          this.customMessageService.showError(
            'Ocurrió un error',
            'Intentá nuevamente'
          );
        },
      });
  }

  private async saveExpense(
    amount: number,
    member: Member,
    category?: Category
  ) {
    const expense: Expense = {
      ...this.expense,
      amount,
      memberId: member.id,
      categoryId: category?.id,
    };

    await this.expenseService.updateItem(expense.id, expense);
    return expense;
  }

  private validateMember$(member: string | Member) {
    return from(this.memberService.validateMember(member)).pipe(
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
}
