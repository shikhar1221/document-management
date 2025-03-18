// src/document/document.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Express } from 'express';
import { Multer } from 'multer';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Roles(Role.Admin, Role.Editor)
  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) createDocumentDto: CreateDocumentDto) {
    try {
      return await this.documentService.create(createDocumentDto);
    } catch (error) {
      throw new HttpException('Failed to create document', 500);
    }
  }

  @Roles(Role.Admin, Role.Editor, Role.Viewer)
  @Get()
  async findAll() {
    try {
      return await this.documentService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch documents', 500);
    }
  }

  @Roles(Role.Admin, Role.Editor, Role.Viewer)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.documentService.findOne(id);
    } catch (error) {
      throw new HttpException('Failed to fetch document', 500);
    }
  }

  @Roles(Role.Admin, Role.Editor)
  @Put(':id/metadata')
  async updateMetadata(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) updateMetadataDto: UpdateMetadataDto,
  ) {
    try {
      return await this.documentService.updateMetadata(id, updateMetadataDto);
    } catch (error) {
      throw new HttpException('Failed to update metadata', 500);
    }
  }

  @Roles(Role.Admin, Role.Editor)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file: Multer.File,
  ) {
    try {
      return await this.documentService.update(id, updateDocumentDto, file);
    } catch (error) {
      throw new HttpException('Failed to update document', 500);
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.documentService.remove(id);
      return { message: 'Document deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete document', 500);
    }
  }

  @Roles(Role.Admin, Role.Editor)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Multer.File,
  ) {
    try {
      return await this.documentService.uploadFile(id, file);
    } catch (error) {
      throw new HttpException('Failed to upload file', 500);
    }
  }
}