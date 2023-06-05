import { Injectable } from '@angular/core';
import { StateCrud, Category } from '../models';
import { StateService } from './state.service';
import { CategoryService } from './category.service';

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
export class CategoryStateService
  extends StateService<CategoryState>
  implements StateCrud<Category>
{
  allItems$ = this.select(({ categories }) => categories);

  selectedItem$ = this.select(({ selectedCategory }) => selectedCategory);

  constructor(private categoryService: CategoryService) {
    super(initialState);
    this.getAllItems();
  }

  async getAllItems() {
    const categories = (await this.categoryService.getAll()) ?? [];
    this.setState({ categories });
  }

  async selectItem(id: string) {
    const selectedCategory = await this.categoryService.get(id);
    this.setState({ selectedCategory });
  }

  async addItem(member: Category) {
    await this.categoryService.add(member);
    await this.getAllItems();
  }

  async updateItem(id: string, member: Category) {
    await this.categoryService.update(id, member);
    await this.getAllItems();
  }

  async deleteItem(id: string) {
    await this.categoryService.delete(id);
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
