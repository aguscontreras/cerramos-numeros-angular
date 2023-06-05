import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';

const INITIAL_STATE = new InjectionToken('initialState');

@Injectable({
  providedIn: 'root',
})
export class StateService<T> {
  private state$: BehaviorSubject<T>;

  protected get state(): T {
    return this.state$.getValue();
  }

  constructor(@Inject(INITIAL_STATE) initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  protected setState(newState: Partial<T>) {
    this.state$.next({
      ...this.state,
      ...newState,
    });
  }
}
