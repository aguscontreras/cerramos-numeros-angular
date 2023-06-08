import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  take,
  tap,
} from 'rxjs';
import { MemberService } from './member.service';
import { CategoryService } from './category.service';
import { ExpenseService } from './expense.service';
import { Category, DetailedExpense, Member } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DetailedExpenseService {
  detailedExpenses$: Observable<DetailedExpense[]>;

  totalAmount$: Observable<number>;

  private totalAmountSource: BehaviorSubject<number>;

  constructor(
    private expenseService: ExpenseService,
    private memberService: MemberService,
    private categoryService: CategoryService
  ) {
    this.detailedExpenses$ = this.getDetailed$();
    this.totalAmountSource = new BehaviorSubject(0);
    this.totalAmount$ = this.totalAmountSource.asObservable();
  }

  private getDetailed$(): Observable<DetailedExpense[]> {
    const members$ = this.memberService.allItems$;
    const categories$ = this.categoryService.allItems$;
    const expenses$ = this.expenseService.allItems$.pipe(
      filter((e) => e.length > 0)
    );

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
