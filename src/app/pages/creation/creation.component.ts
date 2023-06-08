import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ExpenseService } from '../../services/expense.service';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
})
export class CreationComponent {
  members$ = this.membersStateService.allItems$;

  categories$ = this.categoryService.allItems$;

  totalAmount$ = this.expenseService.totalAmount$;

  constructor(
    private membersStateService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) {}
}
