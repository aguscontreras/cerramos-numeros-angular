import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { MemberStateService } from './member-state.service';
import { CategoryStateService } from './category-state.service';
import { ExpenseStateService } from './expense-state.service';
import { Category, DetailedExpense, Member } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DetailedExpenseService {
  detailedExpenses$: Observable<DetailedExpense[]>;

  totalAmount$: Observable<number>;

  private totalAmountSource: BehaviorSubject<number>;

  constructor(
    private expenseStateService: ExpenseStateService,
    private memberStateService: MemberStateService,
    private categoryStateService: CategoryStateService
  ) {
    this.detailedExpenses$ = this.getDetailed$();
    this.totalAmountSource = new BehaviorSubject(0);
    this.totalAmount$ = this.totalAmountSource.asObservable();
  }

  private getDetailed$(): Observable<DetailedExpense[]> {
    const expenses$ = this.expenseStateService.allItems$;
    const members$ = this.memberStateService.allItems$;
    const categories$ = this.categoryStateService.allItems$;

    return combineLatest([expenses$, members$, categories$]).pipe(
      map(([expenses, members, categories]) =>
        expenses.map((expense) => {
          return expense.categoryId
            ? {
                ...expense,
                member: this.findById(expense.memberId, members),
                category: this.findById(expense.categoryId, categories),
              }
            : {
                ...expense,
                member: this.findById(expense.memberId, members),
              };
        })
      ),
      tap((detailed) => {
        const total = detailed
          .map(({ amount }) => amount)
          .reduce((amount, acc) => (acc += amount), 0);

        this.totalAmountSource.next(total);
      })
    );
  }

  private findById<Type extends Member | Category>(
    id: string,
    source: Type[]
  ): Type {
    const item = source.find((e) => e.id === id);

    if (!item) {
      throw new Error(`[Detailed Expense Service] Item not found: ${id}`);
    }

    return item;
  }
}
