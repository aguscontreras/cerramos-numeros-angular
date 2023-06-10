import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyService } from '../../services/party.service';
import { Party, PartyLike } from '../../models';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  allParties$!: Observable<PartyLike[]>;

  constructor(private partyService: PartyService, private router: Router) {}

  ngOnInit(): void {
    this.allParties$ = this.partyService.allItems$.pipe(
      map((res) => res.slice(0, 5))
    );
  }

  async createParty() {
    const party = new Party();

    await Promise.all([
      this.partyService.add(party),
      this.partyService.selectItem(party.id),
      this.partyService.getAllItems(),
    ]);

    this.router.navigate(['/create']);
  }

  async continueParty(party: PartyLike) {
    await this.partyService.selectItem(party.id);

    setTimeout(() => {
      this.router.navigate(['/create']);
    }, 200);
  }
}
