import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PartyService } from '../services/party.service';
import { catchError, filter, map, of, timeout } from 'rxjs';
import { Router } from '@angular/router';

export const currentPartyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const partyService = inject(PartyService);

  return partyService.selectedItem$.pipe(
    filter(Boolean),
    timeout(10),
    map(() => true),
    catchError(() => {
      console.error('[Current Party Guard] Current party does not exist.');
      router.navigate(['/']);
      return of(false);
    })
  );
};
