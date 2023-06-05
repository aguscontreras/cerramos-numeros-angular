import { Component } from '@angular/core';
import { MemberStateService } from '../../services/member-state.service';
import { CategoryStateService } from '../../services/category-state.service';
import { ExpenseStateService } from '../../services/expense-state.service';

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
    private membersStateService: MemberStateService,
    private categoryStateService: CategoryStateService,
    private expenseStateService: ExpenseStateService
  ) {}
}
