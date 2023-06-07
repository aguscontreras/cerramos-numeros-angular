import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetailedExpense } from '../../models';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss'],
})
export class DetailCardComponent {
  @Input() expense!: DetailedExpense;

  @Output() viewOptions = new EventEmitter<DetailedExpense>();
}
