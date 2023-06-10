import { Component, Input } from '@angular/core';
import { PartyLike } from '../../models';

@Component({
  selector: 'app-party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.scss'],
})
export class PartyCardComponent {
  @Input() party!: PartyLike;
}
