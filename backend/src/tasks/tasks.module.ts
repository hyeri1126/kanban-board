import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task } from '../entities/task.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Task]),
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
