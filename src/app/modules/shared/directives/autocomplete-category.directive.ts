import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
import { CategoryService } from '../../../services/category.service';

@Directive({
  selector: '[appAutocompleteCategory]',
  standalone: true,
})
export class AutocompleteCategoryDirective extends AutocompleteBaseDirective<'categories'> {
  constructor(
    @Host() public override autocomplete: AutoComplete,
    public categoryStateService: CategoryService
  ) {
    super(autocomplete, categoryStateService, 'name');
  }
}
