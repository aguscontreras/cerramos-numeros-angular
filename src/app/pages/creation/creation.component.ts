import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PartyService } from '../../services/party.service';
import { DetailedExpense, ExpenseByMember, PartyLike } from '../../models';
import { CustomMessageService } from '../../services/custom-message.service';
import { DetailedExpenseService } from '../../services/detailed-expense.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
})
export class CreationComponent implements OnInit {
  currentParty!: PartyLike;

  expenses$: Observable<DetailedExpense[]>;

  members$: Observable<ExpenseByMember[]>;

  totalAmount$: Observable<number>;

  editingName = false;

  constructor(
    private partyService: PartyService,
    private customMessageService: CustomMessageService,
    private detailedExpenseService: DetailedExpenseService
  ) {
    this.expenses$ = this.detailedExpenseService.getByExpense$();
    this.members$ = this.detailedExpenseService.getByMember$();
    this.totalAmount$ = this.detailedExpenseService.totalAmount$;
  }

  ngOnInit(): void {
    this.partyService.selectedItem$
      .pipe(take(1))
      .subscribe((currentParty) => (this.currentParty = currentParty));
  }

  async saveName() {
    try {
      await Promise.all([
        this.partyService.update(this.currentParty),
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
