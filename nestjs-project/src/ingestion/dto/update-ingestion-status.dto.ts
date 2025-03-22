// dto/update-ingestion-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { IngestionStatusEnum } from '../enums/ingestion-status.enum';

export class UpdateIngestionStatusDto {
  @ApiProperty({
    description: 'The ID of the ingestion status to update',
    example: 1
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The new status of the ingestion',
    enum: IngestionStatusEnum
  })
  @IsEnum(IngestionStatusEnum)
  status: IngestionStatusEnum;

  @ApiProperty({
    description: 'Optional error message if ingestion failed',
    required: false
  })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiProperty({
    description: 'Optional metadata about the ingestion',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}