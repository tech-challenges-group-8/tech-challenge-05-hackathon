import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskCheckListModel, TaskCheckListSchema } from './task-checklist.schema';
import { TaskCheckListController } from "./task-checklist.controller";
import { TaskCheckListRepositoryMongoose } from "./task-checklist.repository";
import { CreateTaskCheckListUseCase, DeleteTaskCheckListUseCase, GetTaskCheckListUseCase, ListTaskCheckListUseCase, UpdateTaskCheckListUseCase } from "@mindease/domain";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskCheckListModel.name, schema: TaskCheckListSchema },
    ]),
  ],
  controllers: [TaskCheckListController],
  providers: [
    TaskCheckListRepositoryMongoose,
    {
      provide: 'TaskCheckListRepository',
      useClass: TaskCheckListRepositoryMongoose,
    },
    {
      provide: CreateTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepositoryMongoose) => new CreateTaskCheckListUseCase(repo),
      inject: [TaskCheckListRepositoryMongoose],
    },
    {
      provide: ListTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepositoryMongoose) => new ListTaskCheckListUseCase(repo),
      inject: [TaskCheckListRepositoryMongoose],
    },
    {
      provide: UpdateTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepositoryMongoose) => new UpdateTaskCheckListUseCase(repo),
      inject: [TaskCheckListRepositoryMongoose],
    },
    {
      provide: DeleteTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepositoryMongoose) => new DeleteTaskCheckListUseCase(repo),
      inject: [TaskCheckListRepositoryMongoose],
    },
    {
      provide: GetTaskCheckListUseCase,
      useFactory: (repo: TaskCheckListRepositoryMongoose) => new GetTaskCheckListUseCase(repo),
      inject: [TaskCheckListRepositoryMongoose],
    },
  ],
  exports: [TaskCheckListRepositoryMongoose, 'TaskCheckListRepository'],
})
export class TaskCheckListModule { }