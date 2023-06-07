import { Component } from '@angular/core';
import { DetailedExpenseService } from '../../services/detailed-expense.service';
import { Observable } from 'rxjs';
import { DetailedExpense } from '../../models';
import { ExpenseService } from '../../services/expense.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';

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
    private expenseService: ExpenseService,
    private dialogService: DialogService
  ) {
    this.detailedExpenses$ = this.detailedExpenseService.detailedExpenses$;
    this.totalAmount$ = this.detailedExpenseService.totalAmount$;
  }

  reverse() {
    this.expenseService.reverseAllItems();
    this.reversed = !this.reversed;
  }

  editExpense(expense: DetailedExpense) {
    this.dialogService.open(ExpenseEditComponent, {
      header: 'Editar gasto',
      width: '80%',
      data: {
        expense,
      },
    });
  }
}
