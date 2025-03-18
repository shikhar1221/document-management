// src/document/dto/update-document.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  content?: string;

  @IsNotEmpty()
  metadata?: Record<string, any>;
}