import { DetailedExpense } from './detailed-expense.model';
import { Member } from './member.model';

export interface ExpenseByMember {
  totalAmount: number;
  member: Member;
  expenses: DetailedExpense[];
}
