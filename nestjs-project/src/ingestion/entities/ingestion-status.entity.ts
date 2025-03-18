
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ingestion_status')
export class IngestionStatus {
  save(): IngestionStatus | PromiseLike<IngestionStatus> {
    throw new Error('Method not implemented.');
  }
  @PrimaryColumn()
  documentId: string;

  @Column()
  status: string;

  @Column()
  startedAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
