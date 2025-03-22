import { ApiProperty } from '@nestjs/swagger';
import { IngestionStatusEnum } from '../enums/ingestion-status.enum';

export class CreateIngestionStatusDto {
  @ApiProperty({
    description: 'The ID of the document being ingested',
    example: '507f1f77bcf86cd799439011',
  })
  documentId: string;

  @ApiProperty({
    description: 'The current status of the ingestion',
    example: IngestionStatusEnum.PENDING,
    enum: IngestionStatusEnum,
  })
  status: IngestionStatusEnum;

  @ApiProperty({
    description: 'Timestamp when the ingestion started',
    example: new Date().toISOString(),
  })
  startedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the status was last updated',
    example: new Date().toISOString(),
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Metadata about the ingestion',
    example: {
      fileName: 'document.pdf',
      filePath: '/path/to/document.pdf',
      createdAt: '2023-03-22T11:06:51.000Z',
      retryCount: 0
    }
  })
  metadata: Record<string, any>;
}