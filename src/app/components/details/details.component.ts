import { Component } from '@angular/core';
import { DetailedExpenseService } from '../../services/detailed-expense.service';
import { Observable } from 'rxjs';
import { DetailedExpense } from '../../models';
import { ExpenseService } from '../../services/expense.service';
import { DialogService } from 'primeng/dynamicdialog';

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
    private expenseStateService: ExpenseService,
    private dialogService: DialogService
  ) {
    this.detailedExpenses$ = this.detailedExpenseService.detailedExpenses$;
    this.totalAmount$ = this.detailedExpenseService.totalAmount$;
  }

  reverse(): void {
    this.expenseStateService.reverseAllItems();
    this.reversed = !this.reversed;
  }

  editExpense(expense: DetailedExpense) {
    window.console.log(expense);
  }
}
