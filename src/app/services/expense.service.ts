import { Injectable } from '@angular/core';
import { Expense, StateStoreModel } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { StateService } from './state.service';

interface ExpenseState extends StateStoreModel<Expense> {
  totalAmount: number;
}

const initialState: ExpenseState = {
  allItems: [],
  selectedItem: undefined,
  totalAmount: 0,
};

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends StateService<ExpenseState> {
  allItems$ = this.select(({ allItems }) => allItems);

  selectedItem$ = this.select(({ selectedItem }) => selectedItem);

  totalAmount$ = this.select(({ totalAmount }) => totalAmount);

  constructor(private interactor: DatabaseInteractor<'expenses'>) {
    super(initialState);
    this.getAllItems('amount');
  }

  async getAllItems(): Promise<void>;
  async getAllItems(orderBy: 'amount' | 'member-id'): Promise<void>;
  async getAllItems(orderBy?: 'amount' | 'member-id'): Promise<void> {
    let allItems: Expense[];

    if (!orderBy) {
      allItems = (await this.interactor.getAll()) ?? [];
    } else {
      switch (orderBy) {
        case 'amount':
          allItems = (await this.interactor.getAllFromIndex('by-amount')) ?? [];
          break;

        case 'member-id':
          allItems =
            (await this.interactor.getAllFromIndex('by-member-id')) ?? [];
          break;
        default:
          allItems = [];
          break;
      }
    }

    this.setState({ allItems });
    this.calculateTotal();
  }

  async selectItem(id: string) {
    const selectedItem = await this.interactor.get(id);
    this.setState({ selectedItem });
  }

  async addItem(expense: Expense) {
    await this.interactor.add(expense);
  }

  async updateItem(expense: Expense) {
    await this.interactor.update(expense);
  }

  async deleteItem(id: string) {
    await this.interactor.delete(id);
  }

  async deleteAllByMemberId(id: string) {
    const memberExpenses = this.state.allItems.filter(
      ({ memberId }) => memberId === id
    );

    this.setState({ allItems: [] });

    const queue = [];

    for (const expense of memberExpenses) {
      queue.push(this.interactor.delete(expense.id));
    }

    await Promise.all(queue);
  }

  private calculateTotal() {
    const totalAmount = this.state.allItems
      .map((exp) => exp.amount)
      .reduce((amount, acc) => (acc += amount), 0);

    this.setState({ totalAmount });
  }

  reverseAllItems() {
    const allItems = [...this.state.allItems];
    this.setState({ allItems: allItems.reverse() });
  }
}
