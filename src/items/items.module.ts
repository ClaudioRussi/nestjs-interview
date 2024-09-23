import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';
import { BullModule } from '@nestjs/bull';
import { CompleteProcessor } from './items.processor';

@Module({
  controllers: [ItemsController],
  providers: [CompleteProcessor, ItemsService],
  imports: [
    TodoListsModule,
    BullModule.registerQueue({
      name: 'item-queue'
    })
  ]
})
export class ItemsModule {}
