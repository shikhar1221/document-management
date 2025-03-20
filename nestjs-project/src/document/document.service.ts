// src/document/document.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentRepository } from './repositories/document.repository';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';
import { DocumentEntity } from './entities/document.entity';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Multer } from 'multer';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private readonly configService = new ConfigService();

  constructor(
    // private readonly configService: ConfigService,

    private readonly documentRepository: DocumentRepository,
    // private readonly logger: Logger,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentEntity> {
    try {
      const document = await this.documentRepository.createDocument(createDocumentDto);
      this.logger.log(`Document created with ID: ${document.id}`);
      return document;
    } catch (error) {
      this.logger.error('Error creating document:', error);
      throw error;
    }
  }

  async findAll(): Promise<DocumentEntity[]> {
    try {
      const documents = await this.documentRepository.findAll();
      this.logger.log(`Fetched ${documents.length} documents`);
      return documents;
    } catch (error) {
      this.logger.error('Error fetching documents:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<DocumentEntity> {
    try {
      const document = await this.documentRepository.findOneById(id);
      if (!document) {
        throw new Error(`Document with ID ${id} not found`);
      }
      this.logger.log(`Fetched document with ID: ${id}`);
      return document;
    } catch (error) {
      this.logger.error('Error fetching document:', error);
      throw error;
    }
  }

  async updateMetadata(id: string, updateMetadataDto: UpdateMetadataDto): Promise<DocumentEntity> {
    try {
      const document = await this.findOne(id);
      document.metadata = {
        ...document.metadata,
        ...updateMetadataDto.metadata,
      };
      const updatedDocument = await this.documentRepository.updateDocument(id, {
        metadata: document.metadata,
      });
      this.logger.log(`Updated metadata for document with ID: ${id}`);
      return updatedDocument;
    } catch (error) {
      this.logger.error('Error updating metadata:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    file: Multer.File,
  ): Promise<DocumentEntity> {
    try {
      const document = await this.findOne(id);
      if (updateDocumentDto.title) document.title = updateDocumentDto.title;
      if (updateDocumentDto.content) document.content = updateDocumentDto.content;
      
      // Handle file upload
      if (file) {
        const fileName = `${uuidv4()}${extname(file.originalname)}`;
        const uploadPath = this.configService.get<string>('UPLOAD_DIRECTORY') || './uploads';
        await this.saveFile(file, `${uploadPath}/${fileName}`);
        document.metadata = {
          ...document.metadata,
          file: {
            name: file.originalname,
            path: fileName,
            size: file.size,
            type: file.mimetype,
          },
        };
      }

      const updatedDocument = await this.documentRepository.updateDocument(id, document);
      this.logger.log(`Updated document with ID: ${id}`);
      return updatedDocument;
    } catch (error) {
      this.logger.error('Error updating document:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const document = await this.findOne(id);
      await this.documentRepository.removeDocument(id);
      this.logger.log(`Deleted document with ID: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting document:', error);
      throw error;
    }
  }

  async uploadFile(id: string, file: Multer.File): Promise<DocumentEntity> {
    try {
      const document = await this.findOne(id);
      const fileName = `${uuidv4()}${extname(file.originalname)}`;
      const uploadPath = this.configService.get<string>('UPLOAD_DIRECTORY') || './uploads';
      await this.saveFile(file, `${uploadPath}/${fileName}`);
      
      document.metadata = {
        ...document.metadata,
        file: {
          name: file.originalname,
          path: fileName,
          size: file.size,
          type: file.mimetype,
        },
      };

      const updatedDocument = await this.documentRepository.updateDocument(id, document);
      this.logger.log(`Uploaded file to document with ID: ${id}`);
      return updatedDocument;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  private async saveFile(file: Multer.File, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(path);
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
      writeStream.end(file.buffer);
    });
  }
}