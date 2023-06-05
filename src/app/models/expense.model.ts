export class Expense {
  categoryId: string;

  memberId: string;

  amount: number;

  readonly id: string;

  constructor(amount: number, memberId: string, categoryId: string) {
    this.id = window.crypto.randomUUID();
    this.memberId = memberId;
    this.categoryId = categoryId;
    this.amount = amount;
  }
}
