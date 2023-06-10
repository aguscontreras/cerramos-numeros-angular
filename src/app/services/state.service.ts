import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';

const INITIAL_STATE = new InjectionToken('initialState');

@Injectable({
  providedIn: 'root',
})
export class StateService<Schema> {
  private state$: BehaviorSubject<Schema>;

  protected get state(): Schema {
    return this.state$.getValue();
  }

  constructor(@Inject(INITIAL_STATE) initialState: Schema) {
    this.state$ = new BehaviorSubject<Schema>(initialState);
  }

  protected select<K>(mapFn: (state: Schema) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: Schema) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  protected setState(newState: Partial<Schema>) {
    this.state$.next({
      ...this.state,
      ...newState,
    });
  }
}
