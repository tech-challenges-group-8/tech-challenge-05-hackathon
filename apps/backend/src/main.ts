import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  
  console.log(`✅ Server running on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
