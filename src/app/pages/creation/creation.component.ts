import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ExpenseService } from '../../services/expense.service';
import { MemberService } from '../../services/member.service';
import { PartyService } from '../../services/party.service';
import { Category, Member, PartyLike } from '../../models';
import { CustomMessageService } from '../../services/custom-message.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
})
export class CreationComponent implements OnInit {
  currentParty!: PartyLike;

  members$: Observable<Member[]>;

  categories$: Observable<Category[]>;

  totalAmount$: Observable<number>;

  editingName = false;

  constructor(
    private partyService: PartyService,
    private membersStateService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private customMessageService: CustomMessageService
  ) {
    this.members$ = this.membersStateService.allItems$;
    this.categories$ = this.categoryService.allItems$;
    this.totalAmount$ = this.expenseService.totalAmount$;
  }

  ngOnInit(): void {
    this.partyService.selectedItem$
      .pipe(take(1))
      .subscribe((currentParty) => (this.currentParty = currentParty));
  }

  async saveName() {
    try {
      await Promise.all([
        this.partyService.updateItem(this.currentParty),
        this.partyService.getAllItems(),
      ]);

      this.editingName = !this.editingName;

      this.customMessageService.showSuccess('Éxito', 'Nombre cambiado');
    } catch (error) {
      console.error(
        `[Creation] Error updating party name. ${this.currentParty.id}`
      );

      this.customMessageService.showError(
        'Hubo un error',
        'Intentá nuevamente'
      );
    }
  }
}
