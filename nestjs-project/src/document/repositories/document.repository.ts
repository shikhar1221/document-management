import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { UpdateMetadataDto } from '../dto/update-metadata.dto';

@Injectable()
export class DocumentRepository {
  private repository: Repository<DocumentEntity>;
  private readonly logger = new Logger(DocumentRepository.name);

  constructor(
    private dataSource: DataSource,
  ) {
    this.repository = this.dataSource.getRepository(DocumentEntity);
  }

  async createDocument(createDocumentDto: CreateDocumentDto): Promise<DocumentEntity> {
    try {
      const document = this.repository.create(createDocumentDto);
      return await this.repository.save(document);
    } catch (error:any) {
      this.logger.error('Error creating document', error.stack);
      throw error;
    }
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto): Promise<DocumentEntity> {
    const document = await this.repository.findOne({ where: { id: parseInt(id) } });
    if (!document) {
      throw new Error('Document not found');
    }
    this.repository.merge(document, updateDocumentDto);
    return this.repository.save(document);
  }

  async updateMetadata(id: string, updateMetadataDto: UpdateMetadataDto): Promise<DocumentEntity> {
    const document = await this.repository.findOne({ where: { id: parseInt(id) } });
    if (!document) {
      throw new Error('Document not found');
    }
    this.repository.merge(document, updateMetadataDto);
    return this.repository.save(document);
  }

  async findAll(): Promise<DocumentEntity[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<DocumentEntity> {
    return this.repository.findOne({ where: { id: parseInt(id) } });
  }

  async removeDocument(id: string): Promise<DocumentEntity> {
    const document = await this.repository.findOne({ where: { id: parseInt(id) } });
    if (!document) {
      throw new Error('Document not found');
    }
    return this.repository.remove(document);
  }
}