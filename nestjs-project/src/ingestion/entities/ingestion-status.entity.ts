
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocumentEntity } from '../../document/entities/document.entity';
import { IsEnum } from 'class-validator';
import { IngestionStatusEnum } from '../enums/ingestion-status.enum';


@Entity('ingestion_status')
export class IngestionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @ManyToOne(() => DocumentEntity)
  @JoinColumn({ name: 'documentId' })
  document: DocumentEntity;

  @Column({
    type: 'enum',
    enum: IngestionStatusEnum,
    default: IngestionStatusEnum.PENDING
  })
  @IsEnum(IngestionStatusEnum)
  status: IngestionStatusEnum;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}
