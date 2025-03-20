import { Module } from '@nestjs/common'
import { IngestionController } from './ingestion.controller'
import { IngestionService } from './ingestion.service'
import { DocumentModule } from 'src/document/document.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngestionStatusRepository } from './repositories/ingestion-status.repository'
import { AuthModule } from 'src/auth/auth.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [TypeOrmModule.forFeature([IngestionStatusRepository]),
  DocumentModule, AuthModule, HttpModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
