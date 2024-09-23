import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { ItemsModule } from './items/items.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TodoListsModule, 
    ItemsModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
