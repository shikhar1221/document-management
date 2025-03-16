import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { IngestionStatus } from './entities/ingestion-status.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionStatus)
    private readonly ingestionStatusRepository: Repository<IngestionStatus>,
  ) {}

  async triggerIngestion(triggerIngestionDto: TriggerIngestionDto): Promise<string> {
    // Logic to trigger the ingestion process
    // This could involve calling an external API or starting a background job

    const status = new IngestionStatus();
    status.triggeredAt = new Date();
    status.status = 'In Progress';
    
    await this.ingestionStatusRepository.save(status);

    // Return a message or ID for tracking the ingestion process
    return 'Ingestion process triggered successfully';
  }

  async getIngestionStatus(id: number): Promise<IngestionStatus> {
    return this.ingestionStatusRepository.findOne(id);
  }
}