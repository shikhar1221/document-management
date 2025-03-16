import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  triggerIngestion(@Body() triggerIngestionDto: TriggerIngestionDto) {
    return this.ingestionService.triggerIngestion(triggerIngestionDto);
  }

  @Get(':id')
  getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }
}