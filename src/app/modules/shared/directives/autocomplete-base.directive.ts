import {
  Directive,
  EventEmitter,
  Host,
  HostListener,
  Inject,
  Output,
} from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';

/** Aplica configuracion por defecto y funcionalidades extra a los autocomplete de primeNg.*/
@Directive({
  selector: '[appAutocompleteBase]',
  standalone: true,
})
export class AutocompleteBaseDirective<T extends object> {
  private _initialData: T[] = [];

  @Output() initialDataLoaded = new EventEmitter<T[]>();

  constructor(
    @Host() public autocomplete: AutoComplete,
    @Inject('autocompleteBaseField') private field: keyof T
  ) {
    this.autocomplete.dropdown = true;
    this.autocomplete.field = String(this.field);
  }

  @HostListener('completeMethod', ['$event.query'])
  filterSuggestionsOnInput(query: string) {
    this.autocomplete.suggestions = this.getFilteredSuggestions(query);
  }

  set initialData(data: T[]) {
    if (!data?.length) {
      throw new Error('[Autocomplete base] Data array is missing');
    }

    this._initialData = [...data];
    this.initialDataLoaded.emit(this._initialData);
  }

  getFilteredSuggestions(query: string): T[] {
    const normalize = (e: T[keyof T] | string) =>
      String(e).toLowerCase().replace(/\s/g, '');

    const filtered = this._initialData.filter((option) =>
      normalize(option[this.field]).includes(normalize(query))
    );

    return filtered;
  }
}
