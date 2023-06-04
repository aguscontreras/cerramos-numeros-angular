import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent {
  form: FormGroup;

  members: any[] = [];

  filteredMembers: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      memberId: ['', Validators.required],
      categoryId: ['', Validators.required],
      amount: [0, Validators.required],
    });
  }

  addMember(): void {
    window.console.log(this.form);
  }

  filterCountry(event: { originalEvent: Event; query: string }) {
    const filtered: any[] = [];
    const { query } = event;

    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      if (member.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(member);
      }
    }

    this.filteredMembers = filtered;
  }
}
