import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Enable CORS if needed
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  // Use Helmet to secure the app by setting various HTTP headers
  app.use(helmet());

  // Use global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Document Management System')
    .setDescription('API documentation for the Document Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  // Create RabbitMQ microservice options
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'document_management_queue',
      queueOptions: {
        durable: true,
      },
    },
  };

  // Connect the microservice to the existing app instance
  app.connectMicroservice(microserviceOptions);

  // Start both the HTTP server and the microservice
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`RabbitMQ microservice is connected to: ${microserviceOptions.options.urls}`);
}

bootstrap();