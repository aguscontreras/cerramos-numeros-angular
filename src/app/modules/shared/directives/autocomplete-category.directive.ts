import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
import { CategoryStateService } from '../../../services/category-state.service';

@Directive({
  selector: '[appAutocompleteCategory]',
  standalone: true,
})
export class AutocompleteCategoryDirective extends AutocompleteBaseDirective<'categories'> {
  constructor(
    @Host() public override autocomplete: AutoComplete,
    public categoryStateService: CategoryStateService
  ) {
    super(autocomplete, categoryStateService, 'name');
  }
}
