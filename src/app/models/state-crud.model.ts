import { Observable } from 'rxjs';

export interface StateCrud<T = unknown> {
  allItems$: Observable<T[]>;
  selectedItem$?: Observable<T | undefined>;
  getAllItems: () => void | T | Promise<void> | Promise<T>;
  selectItem?: (id: string) => void | T | Promise<void> | Promise<T>;
  addItem: (item: T) => void | T | Promise<void> | Promise<T>;
  updateItem: (item: T) => void | T | Promise<void> | Promise<T>;
  deleteItem: (id: string) => void | T | Promise<void> | Promise<T>;
}
