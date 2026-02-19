import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskKanbanModel, TaskKanbanSchema } from './task-kanban.schema';
import { TaskKanbanController } from "./task-kanban.controller";
import { TaskKanbanRepositoryMongoose } from "./task-kanban.repository";
import { 
  CreateTaskKanbanUseCase, 
  ListTaskKanbanUseCase, 
  UpdateTaskKanbanUseCase, 
  DeleteTaskKanbanUseCase, 
  GetTaskKanbanUseCase 
} from "@mindease/domain";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskKanbanModel.name, schema: TaskKanbanSchema },
    ]),
  ],
  controllers: [TaskKanbanController],
  providers: [
    TaskKanbanRepositoryMongoose,
    {
      provide: CreateTaskKanbanUseCase,
      useFactory: (repo: TaskKanbanRepositoryMongoose) => new CreateTaskKanbanUseCase(repo),
      inject: [TaskKanbanRepositoryMongoose],
    },
    {
      provide: ListTaskKanbanUseCase,
      useFactory: (repo: TaskKanbanRepositoryMongoose) => new ListTaskKanbanUseCase(repo),
      inject: [TaskKanbanRepositoryMongoose],
    },
    {
      provide: UpdateTaskKanbanUseCase,
      useFactory: (repo: TaskKanbanRepositoryMongoose) => new UpdateTaskKanbanUseCase(repo),
      inject: [TaskKanbanRepositoryMongoose],
    },
    {
      provide: DeleteTaskKanbanUseCase,
      useFactory: (repo: TaskKanbanRepositoryMongoose) => new DeleteTaskKanbanUseCase(repo),
      inject: [TaskKanbanRepositoryMongoose],
    },
    {
      provide: GetTaskKanbanUseCase,
      useFactory: (repo: TaskKanbanRepositoryMongoose) => new GetTaskKanbanUseCase(repo),
      inject: [TaskKanbanRepositoryMongoose],
    },
  ],
  exports: [],
})
export class TaskKanbanModule {}
