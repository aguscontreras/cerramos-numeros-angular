import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  tap,
} from 'rxjs';
import { MemberService } from './member.service';
import { CategoryService } from './category.service';
import { ExpenseService } from './expense.service';
import { PartyService } from './party.service';
import {
  Category,
  DetailedExpense,
  Expense,
  ExpenseByMember,
  Member,
  PartyLike,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class DetailedExpenseService {
  totalAmount$: Observable<number>;

  private totalAmountSource: BehaviorSubject<number>;

  constructor(
    private expenseService: ExpenseService,
    private memberService: MemberService,
    private categoryService: CategoryService,
    private partyService: PartyService
  ) {
    this.totalAmountSource = new BehaviorSubject(0);
    this.totalAmount$ = this.totalAmountSource.asObservable();
  }

  getByMember$(): Observable<ExpenseByMember[]> {
    return this.getByExpense$().pipe(
      map((detailed) => this.createDetailedByMember(detailed))
    );
  }

  getByExpense$(): Observable<DetailedExpense[]> {
    const party$ = this.partyService.selectedItem$;
    const members$ = this.memberService.allItems$;
    const categories$ = this.categoryService.allItems$;
    const expenses$ = this.expenseService.allItems$;

    return combineLatest([party$, members$, categories$, expenses$]).pipe(
      filter(
        ([party, members, , expenses]) =>
          !!party && !!members.length && !!expenses.length
      ),
      map(([party, members, categories, expenses]) => {
        console.log({ party, members, categories, expenses });

        return this.createDetailedExpenses(
          party,
          expenses,
          members,
          categories
        );
      }),
      tap((detailed) => {
        const total = detailed
          .map(({ amount }) => amount)
          .reduce((acc, amount) => (acc += amount), 0);

        this.totalAmountSource.next(total);
      })
    );
  }

  /**
   * Crea modelos de Detailed Expenses a partir
   * de un listado expenses, members, categories y una party
   * @param party Party actual
   * @param expenses Todas las expenses
   * @param members Todos los members
   * @param categories Todas las categories
   * @returns Array de expensas con detalles
   */
  private createDetailedExpenses(
    party: PartyLike,
    expenses: Expense[],
    members: Member[],
    categories: Category[]
  ) {
    return expenses
      .filter(({ partyId }) => partyId === party.id)
      .map((expense) => {
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
      });
  }

  /**
   * Crea modelos de Detailed By Member, que contienen las Expenses
   * agrupadas por Member
   * @param detailed Detailed Expenses sobre las cuales extraer los datos
   * @returns Array de gastos segun su Member
   */
  private createDetailedByMember(detailed: DetailedExpense[]) {
    const memberIdSet = new Set(detailed.map(({ memberId }) => memberId));

    return Array.from(memberIdSet).map((id) => {
      const memberExpenses = detailed.filter(({ memberId }) => memberId === id);

      const totalAmount = memberExpenses.reduce(
        (prev, { amount }) => (prev += amount),
        0
      );

      return {
        totalAmount,
        member: memberExpenses[0].member,
        expenses: memberExpenses,
      };
    });
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
