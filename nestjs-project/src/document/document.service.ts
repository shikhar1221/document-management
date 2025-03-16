import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentEntity> {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
  }

  async findAll(): Promise<DocumentEntity[]> {
    return this.documentRepository.find();
  }

  async findOne(id: number): Promise<DocumentEntity> {
    return this.documentRepository.findOne(id);
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<DocumentEntity> {
    await this.documentRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.documentRepository.delete(id);
  }
}