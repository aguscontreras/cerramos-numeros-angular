export interface ExpenseLike {
  id: string;
  memberId: string;
  amount: number;
  categoryId?: string;
}
