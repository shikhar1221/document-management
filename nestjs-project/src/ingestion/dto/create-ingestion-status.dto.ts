import { ApiProperty } from '@nestjs/swagger';

export class CreateIngestionStatusDto {
  @ApiProperty({
    description: 'The ID of the document being ingested',
    example: '507f1f77bcf86cd799439011',
  })
  documentId: string;

  @ApiProperty({
    description: 'The current status of the ingestion',
    example: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the ingestion started',
    example: '2023-10-01T12:00:00Z',
  })
  startedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the status was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt?: Date;
}