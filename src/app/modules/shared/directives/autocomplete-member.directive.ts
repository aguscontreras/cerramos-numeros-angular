import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
import { Member } from '../../../models';

@Directive({
  selector: '[appAutocompleteMember]',
  standalone: true,
})
export class AutocompleteMemberDirective extends AutocompleteBaseDirective<Member> {
  constructor(@Host() public override autocomplete: AutoComplete) {
    super(autocomplete, 'name');
  }
}
