import {
  Directive,
  EventEmitter,
  Host,
  HostListener,
  Inject,
  Output,
} from '@angular/core';
import { StoreNames } from 'idb';
import { AutoComplete } from 'primeng/autocomplete';
import { LocalDBSchema } from '../../../models';
import { StorageInteractor } from '../../../services/storage-interactor';

/** Aplica configuracion por defecto y funcionalidades extra a los autocomplete de primeNg.*/
@Directive({
  selector: '[appAutocompleteBase]',
  standalone: true,
})
export class AutocompleteBaseDirective<N extends StoreNames<LocalDBSchema>> {
  private _initialData: LocalDBSchema[N]['value'][] = [];

  @Output() initialDataLoaded = new EventEmitter<LocalDBSchema[N]['value'][]>();

  constructor(
    @Host() public autocomplete: AutoComplete,
    private interactor: StorageInteractor<N>,
    @Inject(String) private field: keyof LocalDBSchema[N]['value']
  ) {
    this.autocomplete.dropdown = true;
    this.autocomplete.field = String(this.field);
    this.getInitialData();
  }

  async getInitialData() {
    const data = await this.interactor.getAll();
    if (data) this.setInitialData(data);
  }

  setInitialData(data: LocalDBSchema[N]['value'][]) {
    if (!data) {
      throw new Error('[Autocomplete base] Data array is missing');
    }

    this._initialData = [...data];
    this.initialDataLoaded.emit(this._initialData);
  }

  refreshData() {
    return this.getInitialData();
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
}
