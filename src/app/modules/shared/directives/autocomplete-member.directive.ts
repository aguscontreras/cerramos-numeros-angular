import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
import { MemberService } from '../../../services/member.service';

@Directive({
  selector: '[appAutocompleteMember]',
  standalone: true,
})
export class AutocompleteMemberDirective extends AutocompleteBaseDirective<'members'> {
  constructor(
    @Host() public override autocomplete: AutoComplete,
    public memberService: MemberService
  ) {
    super(autocomplete, memberService, 'name');
  }
}
