// src/document/dto/update-metadata.dto.ts
import { IsNotEmpty } from 'class-validator';

export class UpdateMetadataDto {
  @IsNotEmpty()
  metadata: Record<string, any>;
}