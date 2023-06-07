import { Injectable } from '@angular/core';
import { StateCrud, Category } from '../models';
import { DatabaseInteractor } from './database-interactor.service';

interface CategoryState {
  categories: Category[];
  selectedCategory?: Category;
}

const initialState: CategoryState = {
  categories: [],
};

@Injectable({
  providedIn: 'root',
})
export class CategoryService
  extends DatabaseInteractor<'categories', CategoryState>
  implements StateCrud<Category>
{
  allItems$ = this.select(({ categories }) => categories);

  selectedItem$ = this.select(({ selectedCategory }) => selectedCategory);

  constructor() {
    super('categories', initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const categories = (await this.getAll()) ?? [];
    this.setState({ categories });
  }

  async selectItem(id: string) {
    const selectedCategory = await this.get(id);
    this.setState({ selectedCategory });
  }

  async addItem(member: Category) {
    await this.add(member);
    await this.getAllItems();
  }

  async updateItem(id: string, member: Category) {
    await this.update(id, member);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    await this.delete(id);
    await this.getAllItems();
  }

  async validateCategory(category: string | Category) {
    if (typeof category === 'string') {
      console.log('[Category state service] New Category should be added');
      const newCategory = new Category(category);
      await this.addItem(newCategory);
      await this.selectItem(newCategory.id);
    } else {
      await this.selectItem(category.id);
    }
  }
}
