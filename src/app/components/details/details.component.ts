import { Component } from '@angular/core';
import { DetailedExpenseService } from '../../services/detailed-expense.service';
import { Observable } from 'rxjs';
import { DetailedExpense } from '../../models';
import { ExpenseStateService } from '../../services/expense-state.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  detailedExpenses$: Observable<DetailedExpense[]>;

  totalAmount$: Observable<number>;

  reversed = false;

  constructor(
    private detailedExpenseService: DetailedExpenseService,
    private expenseStateService: ExpenseStateService
  ) {
    this.detailedExpenses$ = this.detailedExpenseService.detailedExpenses$;
    this.totalAmount$ = this.detailedExpenseService.totalAmount$;
  }

  reverse(): void {
    this.expenseStateService.reverseAllItems();
    this.reversed = !this.reversed;
  }
}
