// src/document/repositories/document.repository.ts
import { EntityRepository, Repository, getManager } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { UpdateMetadataDto } from '../dto/update-metadata.dto';
import { Logger } from '@nestjs/common';
// import { CacheService } from '../cache/cache.service';

@EntityRepository(DocumentEntity)
export class DocumentRepository extends Repository<DocumentEntity> {
  constructor(
    // private readonly cacheService: CacheService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async createDocument(createDocumentDto: CreateDocumentDto): Promise<DocumentEntity> {
    try {
      const document = new DocumentEntity();
      document.title = createDocumentDto.title;
      document.content = createDocumentDto.content;
      document.metadata = createDocumentDto.metadata;
      
      // Use transaction for atomicity
      const savedDocument = await this.manager.transaction(async (transactionalEntityManager) => {
        return transactionalEntityManager.save(document);
      });

      // Clear cache after creating a new document
    //   await this.cacheService.clearCache(`documents:*`);

      return savedDocument;
    } catch (error) {
      this.logger.error('Error creating document:', error);
      throw error;
    }
  }

  async findAll(): Promise<DocumentEntity[]> {
    try {
      // Check cache first
    //   const cacheKey = 'documents:list';
    //   const cachedDocuments = await this.cacheService.get(cacheKey);
    //   if (cachedDocuments) {
    //     return cachedDocuments;
    //   }

      const documents = await this.manager
        .createQueryBuilder(DocumentEntity, 'document')
        .select(['document.id', 'document.title', 'document.createdAt'])
        .orderBy('document.createdAt', 'DESC')
        .getMany();

      // Cache the result
    //   await this.cacheService.set(cacheKey, documents, 60 * 5); // Cache for 5 minutes

      return documents;
    } catch (error) {
      this.logger.error('Error fetching documents:', error);
      throw error;
    }
  }

  async findDocumentById(id: string): Promise<DocumentEntity> {
    try {
      // Check cache first
    //   const cacheKey = `documents:${id}`;
    //   const cachedDocument = await this.cacheService.get(cacheKey);
    //   if (cachedDocument) {
    //     return cachedDocument;
    //   }

      const document = await this.manager
        .createQueryBuilder(DocumentEntity, 'document')
        .where('document.id = :id', { id })
        .getOne();

      // Cache the result
    //   if (document) {
        // await this.cacheService.set(cacheKey, document, 60 * 5); // Cache for 5 minutes
    //   }

      return document;
    } catch (error) {
      this.logger.error('Error fetching document:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto): Promise<DocumentEntity> {
    try {
      const document = await this.findDocumentById(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Use transaction for atomicity
      const updatedDocument = await this.manager.transaction(async (transactionalEntityManager) => {
        if (updateDocumentDto.title) document.title = updateDocumentDto.title;
        if (updateDocumentDto.content) document.content = updateDocumentDto.content;
        
        return transactionalEntityManager.save(document);
      });

      // Clear cache after update
    //   await this.cacheService.clearCache(`documents:${id}`);
    //   await this.cacheService.clearCache(`documents:*`);

      return updatedDocument;
    } catch (error) {
      this.logger.error('Error updating document:', error);
      throw error;
    }
  }

  async updateMetadata(id: string, updateMetadataDto: UpdateMetadataDto): Promise<DocumentEntity> {
    try {
      const document = await this.findOne(id);
      if (!document) {
        throw new Error('Document not found');
      }

      document.metadata = {
        ...document.metadata,
        ...updateMetadataDto.metadata,
      };

      // Use transaction for atomicity
      const updatedDocument = await this.manager.transaction(async (transactionalEntityManager) => {
        return transactionalEntityManager.save(document);
      });

      // Clear cache after metadata update
    //   await this.cacheService.clearCache(`documents:${id}`);
    //   await this.cacheService.clearCache(`documents:*`);

      return updatedDocument;
    } catch (error) {
      this.logger.error('Error updating metadata:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const document = await this.findOne(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Use transaction for atomicity
      await this.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.remove(document);
      });

      // Clear cache after deletion
    //   await this.cacheService.clearCache(`documents:${id}`);
    //   await this.cacheService.clearCache(`documents:*`);
    } catch (error) {
      this.logger.error('Error deleting document:', error);
      throw error;
    }
  }
}