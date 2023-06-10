import { Injectable } from '@angular/core';
import { Expense, StateCrud } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { PartyService } from './party.service';

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

  constructor(private partyService: PartyService) {
    super('expenses', initialState);
    this.getAllItems('amount');
  }

  async getAllItems(): Promise<void>;
  async getAllItems(orderBy: 'amount' | 'member-id'): Promise<void>;
  async getAllItems(orderBy?: 'amount' | 'member-id'): Promise<void> {
    this.partyService.selectedItem$.subscribe({
      next: async (currentParty) => {
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

        expenses = expenses.filter(
          ({ partyId }) => partyId === currentParty.id
        );

        this.setState({ expenses: expenses ?? [] });
        this.calculateTotal();
      },
    });
  }

  async selectItem(id: string) {
    const selectedExpense = await this.get(id);
    this.setState({ selectedExpense });
  }

  async addItem(expense: Expense) {
    await this.add(expense);
  }

  async updateItem(expense: Expense) {
    await this.update(expense);
  }

  async deleteItem(id: string) {
    await this.delete(id);
  }

  async deleteAllByMemberId(id: string) {
    const queue = this.state.expenses
      .filter(({ memberId }) => memberId === id)
      .map((expense) => this.delete(expense.id));

    this.setState({ expenses: [] });

    await Promise.all(queue);
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
