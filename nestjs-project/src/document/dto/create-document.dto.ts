// src/document/dto/create-document.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  metadata: Record<string, any>;
}
