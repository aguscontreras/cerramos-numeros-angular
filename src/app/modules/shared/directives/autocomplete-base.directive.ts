import {
  Directive,
  EventEmitter,
  Host,
  HostListener,
  Inject,
  InjectionToken,
  OnDestroy,
  Output,
} from '@angular/core';
import { StoreNames } from 'idb';
import { AutoComplete } from 'primeng/autocomplete';
import { LocalDBSchema, StateCrud } from '../../../models';
import { Subscription } from 'rxjs';

const STATE_CRUD = new InjectionToken('stateCrud');

@Directive({
  selector: '[appAutocompleteBase]',
  standalone: true,
})
export class AutocompleteBaseDirective<N extends StoreNames<LocalDBSchema>>
  implements OnDestroy
{
  private _initialData: LocalDBSchema[N]['value'][] = [];

  private _dataSubscription: Subscription;

  @Output() initialDataLoaded = new EventEmitter<LocalDBSchema[N]['value'][]>();

  constructor(
    @Host()
    public autocomplete: AutoComplete,
    @Inject(STATE_CRUD)
    private interactor: StateCrud<LocalDBSchema[N]['value']>,
    @Inject(String)
    private field: keyof LocalDBSchema[N]['value']
  ) {
    this.autocomplete.dropdown = true;
    this.autocomplete.field = String(this.field);
    this._dataSubscription = this.interactor.allItems$.subscribe(
      (data) => (this._initialData = data)
    );
  }

  async getInitialData() {
    await this.interactor.getAllItems();
  }

  setInitialData(data: LocalDBSchema[N]['value'][]) {
    if (!data) {
      throw new Error('[Autocomplete base] Data array is missing');
    }

    this._initialData = [...data];
    this.initialDataLoaded.emit(this._initialData);
  }

  refreshData() {
    return this.interactor.getAllItems();
  }

  @HostListener('completeMethod', ['$event.query'])
  filterSuggestionsOnInput(query: string) {
    this.autocomplete.suggestions = this.getFilteredSuggestions(query);
  }

  getFilteredSuggestions(query: string): LocalDBSchema[N]['value'][] {
    const normalize = (
      e: LocalDBSchema[N]['value'][keyof LocalDBSchema[N]['value']] | string
    ) => String(e).toLowerCase().replace(/\s/g, '');

    const filtered = this._initialData.filter((option) =>
      normalize(option[this.field]).includes(normalize(query))
    );

    return filtered;
  }

  ngOnDestroy() {
    this._dataSubscription.unsubscribe();
  }
}
