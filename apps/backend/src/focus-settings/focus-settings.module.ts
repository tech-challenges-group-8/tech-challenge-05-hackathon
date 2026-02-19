import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FocusSettingsModel, FocusSettingsSchema } from './focus-settings.schema';
import { FocusSettingsController } from "./focus-settings.controller";
import { FocusSettingsRepositoryMongoose } from "./focus-settings.repository";
import { 
  CreateFocusSettingsUseCase,
  GetFocusSettingsUseCase, 
  UpdateFocusSettingsUseCase 
} from "@mindease/domain";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FocusSettingsModel.name, schema: FocusSettingsSchema },
    ]),
  ],
  controllers: [FocusSettingsController],
  providers: [
    FocusSettingsRepositoryMongoose,
    {
      provide: GetFocusSettingsUseCase,
      useFactory: (repo: FocusSettingsRepositoryMongoose) => new GetFocusSettingsUseCase(repo),
      inject: [FocusSettingsRepositoryMongoose],
    },
    {
      provide: UpdateFocusSettingsUseCase,
      useFactory: (repo: FocusSettingsRepositoryMongoose) => new UpdateFocusSettingsUseCase(repo),
      inject: [FocusSettingsRepositoryMongoose],
    },
    {
      provide: CreateFocusSettingsUseCase,
      useFactory: (repo: FocusSettingsRepositoryMongoose) => new CreateFocusSettingsUseCase(repo),
      inject: [FocusSettingsRepositoryMongoose],
    },
  ],
  exports: [],
})
export class FocusSettingsModule {}
