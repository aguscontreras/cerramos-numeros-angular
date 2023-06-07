/* eslint-disable import/no-extraneous-dependencies */
import { DBSchema } from 'idb';
import { Member } from './member.model';
import { Category } from './category.model';
import { Expense } from './expense.model';

export interface LocalDBSchema extends DBSchema {
  members: {
    value: Member;
    key: string;
    indexes: { 'by-name': string };
  };
  categories: {
    value: Category;
    key: string;
    indexes: { 'by-name': string };
  };
  expenses: {
    value: Expense;
    key: string;
    indexes: { 'by-amount': number; 'by-member-id': string };
  };
}
