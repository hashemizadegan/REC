import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // اجازه به فرانت‌اند برای فراخوانی APIها
  
  const port = AppConfig.port;
  await app.listen(port);
  console.log(`REC Platform backend running on: http://localhost:${port}`);
}
bootstrap();
