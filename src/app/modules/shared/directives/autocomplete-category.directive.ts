import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
import { Category } from '../../../models';

@Directive({
  selector: '[appAutocompleteCategory]',
  standalone: true,
})
export class AutocompleteCategoryDirective extends AutocompleteBaseDirective<Category> {
  constructor(@Host() public override autocomplete: AutoComplete) {
    super(autocomplete, 'name');
  }
}
