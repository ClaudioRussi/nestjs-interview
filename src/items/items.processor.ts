import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { TodoList } from "src/interfaces/todo_list.interface";
import { ItemsService } from "./items.service";

@Processor('item-queue')
export class CompleteProcessor {

  constructor(
    private readonly itemsService: ItemsService
  ){}

  @Process('batchComplete')
  async batchUpdate(job: Job) {
    const {todoListId, ids}: {todoListId: number, ids: number[]} = job.data;
    this.itemsService.completeAll(todoListId, ids);
  }
}