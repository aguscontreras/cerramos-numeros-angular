import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ExpenseService } from '../../services/expense.service';
import { DetailedExpenseService } from '../../services/detailed-expense.service';
import { MemberService } from '../../services/member.service';
import { EditMemberComponent } from '../edit-member/edit-member.component';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';
import {
  Category,
  DetailedExpense,
  ExpenseByMember,
  Member,
} from '../../models';

enum ShowOptions {
  MEMBER,
  CATEGORY,
  DETAILED_EXPENSE,
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  showBy = ShowOptions.MEMBER;

  detailedExpenses$: Observable<DetailedExpense[]>;

  detailedByMember$: Observable<ExpenseByMember[]>;

  members$: Observable<Member[]>;

  totalAmount$: Observable<number>;

  reversed = false;

  showOptions: SelectItem[];

  constructor(
    private detailedExpenseService: DetailedExpenseService,
    private memberService: MemberService,
    private expenseService: ExpenseService,
    private dialogService: DialogService
  ) {
    this.detailedExpenses$ = this.detailedExpenseService.getByExpense$();
    this.detailedByMember$ = this.detailedExpenseService.getByMember$();
    this.members$ = this.memberService.allItems$;
    this.totalAmount$ = this.detailedExpenseService.totalAmount$;
    this.showOptions = this.getShowOptions();
  }

  getShowOptions(): SelectItem[] {
    return [
      {
        label: 'Personas',
        value: ShowOptions.MEMBER,
      },
      {
        label: 'Categorias',
        value: ShowOptions.CATEGORY,
      },
      {
        label: 'Gastos',
        value: ShowOptions.DETAILED_EXPENSE,
      },
    ];
  }

  reverse() {
    switch (this.showBy) {
      case ShowOptions.MEMBER:
        this.memberService.reverseAllItems();
        break;
      case ShowOptions.CATEGORY:
        console.log('TODO');
        break;
      case ShowOptions.DETAILED_EXPENSE:
        this.expenseService.reverseAllItems();
        break;

      default:
        this.expenseService.reverseAllItems();
        break;
    }
    this.reversed = !this.reversed;
  }

  edit(item: Member): void;
  edit(item: Category): void;
  edit(item: DetailedExpense): void;
  edit(item: any) {
    switch (this.showBy) {
      case ShowOptions.MEMBER:
        this.editMember(item);
        break;
      case ShowOptions.CATEGORY:
        console.log('TODO');
        break;
      case ShowOptions.DETAILED_EXPENSE:
        this.editExpense(item);
        break;

      default:
        this.editExpense(item);
        break;
    }
  }

  private editMember(member: Member) {
    this.dialogService.open(EditMemberComponent, {
      header: 'Editar persona',
      width: '80%',
      data: {
        member,
      },
    });
  }

  private editExpense(expense: DetailedExpense) {
    this.dialogService.open(ExpenseEditComponent, {
      header: 'Editar gasto',
      width: '80%',
      data: {
        expense,
      },
    });
  }

  getTotalAmount$({ id }: Member): Observable<number> {
    return this.detailedExpenses$.pipe(
      map((members) =>
        members
          .filter(({ memberId }) => memberId === id)
          .map(({ amount }) => amount)
          .reduce((prev, amount) => (prev += amount), 0)
      )
    );
  }
}
