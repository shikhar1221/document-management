// src/ingestion/ingestion.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('ingestion')
@UseGuards(JwtAuthGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Roles(Role.Admin, Role.Editor)
  @Post()
  async triggerIngestion(@Body() { documentId }: { documentId: string }) {
    return this.ingestionService.triggerIngestion(documentId);
  }

  @Roles(Role.Admin, Role.Editor, Role.Viewer)
  @Get(':documentId')
  async getIngestionStatus(@Param('documentId') documentId: string) {
    return this.ingestionService.getIngestionStatus(documentId);
  }
}