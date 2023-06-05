export class Expense {
  memberId: string;

  amount: number;

  categoryId?: string;

  readonly id: string;

  constructor(amount: number, memberId: string, categoryId?: string) {
    this.id = window.crypto.randomUUID();
    this.amount = amount;
    this.memberId = memberId;
    this.categoryId = categoryId;
  }
}
