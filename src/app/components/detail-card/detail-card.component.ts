import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss'],
})
export class DetailCardComponent {
  @Input() label = '';

  @Input() amount = 0;

  @Output() viewOptions = new EventEmitter();
}
