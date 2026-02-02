import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CognitiveSettingsModule } from './cognitive-settings/cognitive-settings.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/mindease'
    ),
    UserModule,
    AuthModule,
    CognitiveSettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
