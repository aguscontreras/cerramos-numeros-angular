import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { CategoryService } from '../../services/category.service';
import { ExpenseService } from '../../services/expense.service';
import { AutocompleteMemberDirective } from '../../modules/shared/directives/autocomplete-member.directive';
import { AutocompleteCategoryDirective } from '../../modules/shared/directives/autocomplete-category.directive';
import { Category, Expense, Member } from '../../models';
import { CustomMessageService } from '../../services/custom-message.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent {
  form: FormGroup;

  @ViewChild('memberInput', { read: AutocompleteMemberDirective })
  memberInput?: AutocompleteMemberDirective;

  @ViewChild('categoryInput', { read: AutocompleteCategoryDirective })
  categoryInput?: AutocompleteCategoryDirective;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private customMessageService: CustomMessageService
  ) {
    this.form = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      member: ['', Validators.required],
      category: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  resetForm(): void {
    this.form.reset({
      member: '',
      category: '',
      amount: 0,
    });
  }

  onSubmit() {
    this.addMember()
      .then(() =>
        this.customMessageService.showSuccess('Excelente!', 'Item creado')
      )
      .catch((error) => {
        console.error('[Add member] Error creating member.', error);
        this.customMessageService.showError(
          'Ocurrió un error',
          'Intentá nuevamente'
        );
      });
  }

  private async addMember() {
    if (this.form.invalid) {
      throw new Error('[Add member] Invalid form.', this.form.value);
    }

    const { member, category, amount } = this.form.value;
    const retrievedMember = await this.retrieveMember(member);
    const retrievedCategory = await this.retrieveCategory(category);

    if (!retrievedMember || !retrievedCategory) {
      throw new Error('[Add member] Member or Category not found.');
    }

    await this.saveExpense(amount, retrievedMember, retrievedCategory);
    this.resetForm();
  }

  private async retrieveMember(member: string | Member) {
    if (typeof member === 'string') {
      console.log('[Add member] New Member should be added');
      const newMember = new Member(member);
      await this.memberService.add(newMember);
      await this.memberInput?.refreshData();
      return newMember;
    }

    const existingMember = await this.memberService.get(member.id);
    return existingMember;
  }

  private async retrieveCategory(category: string | Category) {
    if (typeof category === 'string') {
      console.log('[Add member] New Category should be added');
      const newCategory = new Category(category);
      await this.categoryService.add(newCategory);
      await this.categoryInput?.refreshData();
      return newCategory;
    }

    const existingMember = await this.categoryService.get(category.id);
    return existingMember;
  }

  private async saveExpense(
    amount: number,
    member: Member,
    category: Category
  ) {
    const expense = new Expense(amount, member.id, category.id);
    await this.expenseService.add(expense);
    return expense;
  }
}
