import { Injectable, Logger } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { Item } from '../interfaces/item.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ElementNotFoundError } from '../common/exceptions/element-not-found.error';

@Injectable()
export class ItemsService {
  private lastId = 0;
  
  constructor(
    private readonly todoListsService: TodoListsService,
    @InjectQueue('item-queue') 
    private readonly itemQueue: Queue
  ){}

  create(createItemDto: CreateItemDto, todoListId: number) {
    const todoList = this.todoListsService.getTodoList(todoListId);
    const item: Item = {...createItemDto, id: this.lastId + 1};
    this.lastId += 1;
    todoList.items.push(item);

    return item;
  }

  all(todoListId: number) {
    const todoList = this.todoListsService.getTodoList(todoListId);
    return todoList.items;
  }

  get(todoListId: number, id: number) {
    const todoList = this.todoListsService.getTodoList(todoListId);
    const item = todoList.items.find(item => item.id === id);
    if(!item) {
      throw new ElementNotFoundError(`Item with id ${id} not found`);
    }
    return item;
  }

  complete(todoListId: number, id: number) {
    const item = this.get(todoListId, id);
    item.completed = true;
    return item;
  }

  async batchComplete(todoListId: number, ids: number[]) {
    await this.itemQueue.add('batchComplete', {todoListId, ids});
    return {message: 'Batch complete programmed'};
  }

  completeAll(todoListId: number, ids: number[]) {
    const todoList = this.todoListsService.getTodoList(todoListId);
    todoList.items.forEach(item => {
      if (ids.includes(item.id)) {
        item.completed = true;
      }
    });
  }

  delete(todoListId: number, id: number) {
    this.get(todoListId, id);
    const todoList = this.todoListsService.getTodoList(todoListId);
    todoList.items = todoList.items.filter(todo => todo.id !== id);
  }

}
