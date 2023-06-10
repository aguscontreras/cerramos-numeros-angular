import { ExpenseLike } from './expense-like.model';

export class Expense implements ExpenseLike {
  partyId: string;

  memberId: string;

  amount: number;

  categoryId?: string;

  readonly id: string;

  constructor(
    partyId: string,
    amount: number,
    memberId: string,
    categoryId?: string
  ) {
    this.id = window.crypto.randomUUID();
    this.partyId = partyId;
    this.amount = amount;
    this.memberId = memberId;
    this.categoryId = categoryId;
  }
}
