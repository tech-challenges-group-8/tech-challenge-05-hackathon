import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskCheckListController } from './controllers/task-checklist.controller';
import { TaskCheckListModel, TaskCheckListSchema } from './schemas/task-checklist.schema';
import { TaskCheckListRepositoryMongoose } from './schemas/task-checklist.repository';
import { 
  CreateTaskCheckListUseCase, 
  ListTaskCheckListUseCase, 
  UpdateTaskCheckListUseCase, 
  DeleteTaskCheckListUseCase, 
  GetTaskCheckListUseCase,
  TaskCheckListRepository
} from '@mindease/domain';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/mindease'),
    MongooseModule.forFeature([{ name: TaskCheckListModel.name, schema: TaskCheckListSchema }]),
  ],
  controllers: [TaskCheckListController],
  providers: [
    TaskCheckListRepositoryMongoose,
    {
      provide: 'TaskCheckListRepository',
      useExisting: TaskCheckListRepositoryMongoose,
    },
    {
      provide: CreateTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepository) => new CreateTaskCheckListUseCase(repo),
      inject: ['TaskCheckListRepository'],
    },
    {
      provide: ListTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepository) => new ListTaskCheckListUseCase(repo),
      inject: ['TaskCheckListRepository'],
    },
    {
      provide: UpdateTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepository) => new UpdateTaskCheckListUseCase(repo),
      inject: ['TaskCheckListRepository'],
    },
    {
      provide: DeleteTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepository) => new DeleteTaskCheckListUseCase(repo),
      inject: ['TaskCheckListRepository'],
    },
    {
      provide: GetTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepository) => new GetTaskCheckListUseCase(repo),
      inject: ['TaskCheckListRepository'],
    },
  ],
})
export class AppModule {}
