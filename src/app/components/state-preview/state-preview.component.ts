import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-state-preview',
  templateUrl: './state-preview.component.html',
  styleUrls: ['./state-preview.component.scss'],
})
export class StatePreviewComponent {
  @Input() membersAmount = 0;

  @Input() categoriesAmount = 0;

  @Input() totalAmount = 0;
}
