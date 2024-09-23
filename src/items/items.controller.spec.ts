import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

describe('ItemsController', () => {
  let itemsController: ItemsController;
  let itemsService: ItemsService;

  beforeEach(async () => {

    itemsService = new ItemsService(new TodoListsService([
      {
        id: 1, name: 'test1', items: []
      },
    ]
    ), null);

    itemsService.create(
      {
        title: 'Test item',
        completed: false
      },
      1
    );

    itemsService.create(
      {
        title: 'Test item 2',
        completed: false
      },
      1
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [{provide: ItemsService, useValue: itemsService}],
    }).compile();

    itemsController = module.get<ItemsController>(ItemsController);
  });

  describe('index', () => {
    it('should return the items of todolist with the given id', () => {
      expect(itemsController.index(1)).toEqual([
        { id: 1, title: 'Test item', completed: false },
        { id: 2, title: 'Test item 2', completed: false },
      ]);
    });
    it('should throw if the todolist doesnt exist', () => {
      expect(() => itemsController.index(5)).toThrow(NotFoundException);
    });
  });

  describe('show', () => {
    it('should return an item with the given id', () => {
      expect(itemsController.show(1, 1)).toEqual({ 
        id: 1, 
        title: 'Test item', 
        completed: false 
      });
    });
    it('should throw if the todolist doesnt exist', () => {
      expect(() => itemsController.show(5, 1)).toThrow(NotFoundException);
    });
    it('should throw if the item doesnt exist', () => {
      expect(() => itemsController.show(1, 5)).toThrow(NotFoundException);
    });
  });

  describe('complete', () => {
    it('should change the state to complete for the item with the given id', () => {
      expect(
        itemsController.complete(1, 1),
      ).toEqual({ id: 1, title: 'Test item', completed: true });

      expect(itemsService.get(1, 1).completed).toEqual(true);
    });
    it('should throw if the todolist doesnt exist', () => {
      expect(() => itemsController.complete(5, 1)).toThrow(NotFoundException);
    });
    it('should throw if the item doesnt exist', () => {
      expect(() => itemsController.complete(1, 5)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new item', () => {
      expect(itemsController.create({
        title: 'Test item 3',
        completed: false
      },
      1)).toEqual({
        id: 3,
        title: 'Test item 3',
        completed: false
      });

      expect(itemsService.all(1).length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the item with the given id', () => {
      expect(() => itemsController.delete(1, 1)).not.toThrow();

      expect(itemsService.all(1).length).toEqual(1);
    });
    it('should throw if the todolist doesnt exist', () => {
      expect(() => itemsController.delete(5, 1)).toThrow(NotFoundException);
    });
    it('should throw if the item doesnt exist', () => {
      expect(() => itemsController.delete(1, 5)).toThrow(NotFoundException);
    });
  });
});
