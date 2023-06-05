import { Injectable } from '@angular/core';
import { Expense, StateCrud } from '../models';
import { StateService } from './state.service';
import { ExpenseService } from './expense.service';

interface ExpenseState {
  expenses: Expense[];
  selectedExpense?: Expense;
  totalAmount: number;
}

const initialState: ExpenseState = {
  expenses: [],
  selectedExpense: undefined,
  totalAmount: 0,
};

@Injectable({
  providedIn: 'root',
})
export class ExpenseStateService
  extends StateService<ExpenseState>
  implements StateCrud<Expense>
{
  allItems$ = this.select(({ expenses }) => expenses);

  selectedItem$ = this.select(({ selectedExpense }) => selectedExpense);

  totalAmount$ = this.select(({ totalAmount }) => totalAmount);

  constructor(private expenseService: ExpenseService) {
    super(initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const expenses = (await this.expenseService.getAll()) ?? [];
    this.setState({ expenses });
    this.calculateTotal();
  }

  async selectItem(id: string) {
    const selectedExpense = await this.expenseService.get(id);
    this.setState({ selectedExpense });
  }

  async addItem(member: Expense) {
    await this.expenseService.add(member);
    await this.getAllItems();
  }

  async updateItem(id: string, member: Expense) {
    await this.expenseService.update(id, member);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    await this.expenseService.delete(id);
    await this.getAllItems();
  }

  calculateTotal() {
    const totalAmount = this.state.expenses
      .map((exp) => exp.amount)
      .reduce((amount, acc) => (acc += amount), 0);

    this.setState({ totalAmount });
  }
}
