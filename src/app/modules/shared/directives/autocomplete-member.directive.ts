import { Directive, Host } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { AutocompleteBaseDirective } from './autocomplete-base.directive';
// import { MemberService } from '../../../services/member.service';
import { MemberStateService } from '../../../services/member-state.service';

@Directive({
  selector: '[appAutocompleteMember]',
  standalone: true,
})
export class AutocompleteMemberDirective extends AutocompleteBaseDirective<'members'> {
  constructor(
    @Host() public override autocomplete: AutoComplete,
    public memberService: MemberStateService
  ) {
    super(autocomplete, memberService, 'name');
  }
}
