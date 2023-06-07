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

  categories$ = this.categoryStateService.allItems$;

  totalAmount$ = this.expenseStateService.totalAmount$;

  constructor(
    private membersStateService: MemberService,
    private categoryStateService: CategoryService,
    private expenseStateService: ExpenseService
  ) {}
}
