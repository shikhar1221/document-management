// src/document/document.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentEntity } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserEntity } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository, UserRepository],
  exports: [DocumentService],
})
export class DocumentModule {}