import { Category } from './category.model';
import { ExpenseLike } from './expense-like.model';
import { Member } from './member.model';

export interface DetailedExpense extends ExpenseLike {
  member: Member;
  category?: Category;
}
