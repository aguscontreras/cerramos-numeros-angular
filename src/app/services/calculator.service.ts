import { Injectable } from '@angular/core';
import { MemberStateService } from './member-state.service';
import { ExpenseStateService } from './expense-state.service';
import { Observable, forkJoin, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  totalMembers$ = this.getTotalMembers$();

  totalAmount$ = this.expenseStateService.totalAmount$;

  constructor(
    private memberStateService: MemberStateService,
    private expenseStateService: ExpenseStateService
  ) {}

  private getTotalMembers$(): Observable<number> {
    return this.memberStateService.allItems$.pipe(
      map((members) => members.length)
    );
  }

  getResult$() {
    return forkJoin({
      totalMembers: this.totalMembers$.pipe(take(1)),
      totalAmount: this.totalAmount$.pipe(take(1)),
    }).pipe(
      map(({ totalMembers, totalAmount }) => {
        const amountPerCapita = this.getAmountPerCapita(
          totalMembers,
          totalAmount
        );

        return {
          amountPerCapita,
        };
      })
    );
  }

  getAmountPerCapita(totalMembers: number, totalAmount: number): number {
    return totalAmount / totalMembers;
  }
}
