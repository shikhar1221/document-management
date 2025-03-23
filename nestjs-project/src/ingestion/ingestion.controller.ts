import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpCode, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { UpdateIngestionStatusDto } from './dto/update-ingestion-status.dto';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permissions.enum';

@Controller('ingestion')
@ApiTags('Document Ingestion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard,RolesGuard,PermissionsGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  @Permissions(Permission.INGESTION_TRIGGER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Trigger document ingestion process' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Ingestion process started' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  async triggerIngestion(
    @Body(ValidationPipe) triggerIngestionDto: TriggerIngestionDto
  ): Promise<void> {
    const { documentId } = triggerIngestionDto;
    await this.ingestionService.triggerIngestion(documentId.toString());
  }

  @Get(':documentId')
  @Roles(Role.Admin, Role.Editor, Role.Viewer)
  @Permissions(Permission.INGESTION_STATUS)
  @ApiOperation({ summary: 'Get ingestion status for a document' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the ingestion status' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  async getIngestionStatus(
    @Param('documentId', ParseIntPipe) documentId: number
  ) {
    return this.ingestionService.getIngestionStatus(documentId.toString());
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook endpoint for Python backend' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request payload' })
  async updateIngestionStatus(
    @Body(ValidationPipe) payload: UpdateIngestionStatusDto
  ): Promise<void> {
    await this.ingestionService.updateIngestionStatus(
      payload.id,
      payload.status,
      payload.error
    );
  }
}