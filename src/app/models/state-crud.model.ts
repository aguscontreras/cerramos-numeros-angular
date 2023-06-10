import { Observable } from 'rxjs';

export interface StateCrud<T = unknown> {
  allItems$: Observable<T[]>;
  selectedItem$?: Observable<T | undefined>;
  getAllItems: () => void | T | Promise<void> | Promise<T>;
  selectItem?: (id: string) => void | T | Promise<void> | Promise<T>;
  add: (item: T) => void | T | Promise<void> | Promise<T>;
  update: (item: T) => void | T | Promise<void> | Promise<T>;
  delete: (id: string) => void | T | Promise<void> | Promise<T>;
}
