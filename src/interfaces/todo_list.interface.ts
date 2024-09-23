import { Item } from "./item.interface";

export interface TodoList {
  id: number;
  name: string;
  items?: Item[];
}
