import { Injectable } from '@angular/core';
import { Expense, StateCrud } from '../models';
import { DatabaseInteractor } from './database-interactor.service';

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
export class ExpenseService
  extends DatabaseInteractor<'expenses', ExpenseState>
  implements StateCrud<Expense>
{
  allItems$ = this.select(({ expenses }) => expenses);

  selectedItem$ = this.select(({ selectedExpense }) => selectedExpense);

  totalAmount$ = this.select(({ totalAmount }) => totalAmount);

  constructor() {
    super('expenses', initialState);
    this.getAllItems('amount');
  }

  async getAllItems(): Promise<void>;
  async getAllItems(orderBy: 'amount' | 'member-id'): Promise<void>;
  async getAllItems(orderBy?: 'amount' | 'member-id'): Promise<void> {
    let expenses: Expense[];

    if (!orderBy) {
      expenses = (await this.getAll()) ?? [];
    } else {
      switch (orderBy) {
        case 'amount':
          expenses = (await this.getAllFromIndex('by-amount')) ?? [];
          break;

        case 'member-id':
          expenses = (await this.getAllFromIndex('by-member-id')) ?? [];
          break;
        default:
          expenses = [];
          break;
      }
    }

    this.setState({ expenses: expenses ?? [] });
    this.calculateTotal();
  }

  async selectItem(id: string) {
    const selectedExpense = await this.get(id);
    this.setState({ selectedExpense });
  }

  async addItem(expense: Expense) {
    await this.add(expense);
    await this.getAllItems();
  }

  async updateItem(id: string, expense: Expense) {
    await this.update(id, expense);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    await this.delete(id);
    await this.getAllItems();
  }

  async deleteAllByMemberId(id: string) {
    const memberExpenses = this.state.expenses.filter(
      ({ memberId }) => memberId === id
    );

    this.setState({ expenses: [] });

    const queue = [];

    for (const expense of memberExpenses) {
      queue.push(this.delete(expense.id));
    }

    await Promise.all(queue);
    await this.getAllItems();
  }

  private calculateTotal() {
    const totalAmount = this.state.expenses
      .map((exp) => exp.amount)
      .reduce((amount, acc) => (acc += amount), 0);

    this.setState({ totalAmount });
  }

  reverseAllItems() {
    const allItems = [...this.state.expenses];
    this.setState({ expenses: allItems.reverse() });
  }
}
