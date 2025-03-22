import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionStatusRepository } from './repositories/ingestion-status.repository';
import { IngestionStatus } from './entities/ingestion-status.entity';
import { DocumentModule } from '../document/document.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestionStatus]),
    HttpModule,
    DocumentModule,
    AuthModule,
    ConfigModule
  ],
  controllers: [IngestionController],
  providers: [IngestionService, IngestionStatusRepository],
  exports: [IngestionService]
})
export class IngestionModule {}