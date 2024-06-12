import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TODOApp API')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document); // endereço da doc swagger

  /* passando o param whitelist ele só vai atualizar o que está definido na DTO
  /* e o forbidNonWhitelisted para só passar apenas o que vamos alterar
  */
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  ); // definindo um validation pipe para todos os endpoints e controllers.
  await app.listen(3000);
}
bootstrap();
