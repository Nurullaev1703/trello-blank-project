import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors:true
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');
  
  // Apply standardized response format
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Trello API')
    .setDescription('The Trello server API description. This API provides endpoints for managing projects, tasks, users, and authentication.')
    .setVersion('1.1')
    .addTag('Authentication', 'Endpoints for user login and registration')
    .addTag('Users', 'Operations related to user management')
    .addTag('Projects', 'Operations related to project management')
    .addTag('Tasks', 'Operations related to task management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT || 3000);
}
bootstrap();