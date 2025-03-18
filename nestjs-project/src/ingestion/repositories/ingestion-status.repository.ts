import { Repository, EntityRepository } from 'typeorm';
import { IngestionStatus } from '../entities/ingestion-status.entity';
import { CreateIngestionStatusDto } from '../dto/create-ingestion-status.dto';

@EntityRepository(IngestionStatus)
export class IngestionStatusRepository extends Repository<IngestionStatus> {
  async findOne(where: any): Promise<IngestionStatus | null> {
    return super.findOne(where);
  }

  async createIngestionStatus(ingestionStatus: CreateIngestionStatusDto): Promise<IngestionStatus> {
    const status = new IngestionStatus();
    status.documentId = ingestionStatus.documentId;
    status.status = ingestionStatus.status;
    status.startedAt = ingestionStatus.startedAt;
    status.updatedAt = new Date();

    return status.save();
  }

}