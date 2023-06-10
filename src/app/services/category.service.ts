import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Category, StateCrud, StateStoreModel } from '../models';
import { DatabaseInteractor } from './database-interactor.service';
import { StateService } from './state.service';

type CategoryState = StateStoreModel<Category>;

const initialState: CategoryState = {
  allItems: [],
};

const INTERACTOR_CATEGORIES = new InjectionToken('interactor', {
  providedIn: 'root',
  factory: () => new DatabaseInteractor('categories'),
});

@Injectable({
  providedIn: 'root',
})
export class CategoryService
  extends StateService<CategoryState>
  implements StateCrud<Category>
{
  allItems$ = this.select(({ allItems }) => allItems);

  selectedItem$ = this.select(({ selectedItem }) => selectedItem);

  constructor(
    @Inject(INTERACTOR_CATEGORIES)
    private interactor: DatabaseInteractor<'categories'>
  ) {
    super(initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const allItems = (await this.interactor.getAll()) ?? [];
    this.setState({ allItems });
  }

  async selectItem(id: string) {
    const selectedItem = await this.interactor.get(id);
    this.setState({ selectedItem });
  }

  async add(member: Category) {
    await this.interactor.add(member);
  }

  async update(member: Category) {
    await this.interactor.update(member);
  }

  async delete(id: string) {
    await this.interactor.delete(id);
  }

  async validateCategory(category: string | Category) {
    if (typeof category === 'string') {
      console.log('[Category state service] New Category should be added');
      const newCategory = new Category(category);
      await this.add(newCategory);
      await this.selectItem(newCategory.id);
    } else {
      await this.selectItem(category.id);
    }
  }
}
