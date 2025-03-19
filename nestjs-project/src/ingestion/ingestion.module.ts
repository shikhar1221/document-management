import { Module } from '@nestjs/common'
import { IngestionController } from './ingestion.controller'
import { IngestionService } from './ingestion.service'
import { DocumentModule } from 'src/document/document.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngestionStatusRepository } from './repositories/ingestion-status.repository'

@Module({
  imports: [TypeOrmModule.forFeature([IngestionStatusRepository]),
  DocumentModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
