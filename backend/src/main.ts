import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

   const config = new DocumentBuilder()
   .setTitle('QBT Time API')
   .setDescription('QBT Time API documentation')
   .addBearerAuth()
   .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    // app.useGlobalGuards(new JwtAuthGuard()); //comment this line or modify to check for the public decorator
  await app.listen(8002);
}
bootstrap();