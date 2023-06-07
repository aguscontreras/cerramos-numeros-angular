import { Component } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { CategoryService } from '../../services/category.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  members$ = this.membersStateService.allItems$;

  categories$ = this.categoryService.allItems$;

  totalAmount$ = this.expenseService.totalAmount$;

  constructor(
    private membersStateService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) {}
}
