import { NgModule } from '@angular/core';
import { AutocompleteBaseDirective } from './directives/autocomplete-base.directive';
import { AutocompleteCategoryDirective } from './directives/autocomplete-category.directive';
import { AutocompleteMemberDirective } from './directives/autocomplete-member.directive';

const modules = [
  AutocompleteBaseDirective,
  AutocompleteMemberDirective,
  AutocompleteCategoryDirective,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
