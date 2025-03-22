import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AxiosError } from 'axios';
import { DocumentService } from '../document/document.service';
import { IngestionStatusRepository } from './repositories/ingestion-status.repository';
import { IngestionStatus } from './entities/ingestion-status.entity';
import { IngestionStatusEnum } from './enums/ingestion-status.enum';

interface PythonResponse {
  data: {
    status: IngestionStatusEnum;
    metadata?: Record<string, any>;
    error?: string;
  };
}

interface IngestionMetadata {
  retryCount: number;
  startTime: string;
  lastChecked?: string;
  lastRetry?: string;
  fileName?: string;
  filePath?: string;
  mimeType?: string;
  size?: number;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly pythonBackendTimeout = 5000;
  private readonly maxRetries = 3;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly documentService: DocumentService,
    private readonly ingestionStatusRepository: IngestionStatusRepository,
  ) {}

  async triggerIngestion(documentId: string): Promise<IngestionStatus> {
    try {
      const numericDocId = parseInt(documentId, 10);
      const document = await this.documentService.findOne(documentId);

      const ingestionStatus = await this.ingestionStatusRepository.save({
        documentId: numericDocId,
        status: IngestionStatusEnum.PENDING,
        metadata: {
          retryCount: 0,
          startTime: new Date().toISOString(),
          fileName: document.fileName,
          filePath: document.filePath,
          mimeType: document.mimeType,
          size: document.size,
        } as IngestionMetadata,
      });

      const pythonBackendUrl = this.configService.get<string>('PYTHON_BACKEND_URL');
      if (!pythonBackendUrl) {
        throw new HttpException('Python backend URL not configured', HttpStatus.SERVICE_UNAVAILABLE);
      }

      await firstValueFrom(
        this.httpService.post<PythonResponse>(`${pythonBackendUrl}/ingest`, {
          documentId: numericDocId,
          ingestionId: ingestionStatus.id,
          filePath: document.filePath,
          metadata: {
            fileName: document.fileName,
            filePath: document.filePath,
            mimeType: document.mimeType,
            size: document.size,
          },
        }).pipe(
          timeout(this.pythonBackendTimeout),
          catchError((error: AxiosError) => {
            this.logger.error(`Failed to notify Python backend: ${error.message}`);
            throw new HttpException(
              'Failed to communicate with Python backend',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );

      return ingestionStatus;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Failed to trigger ingestion: ${(error as Error).message}`);
      throw new HttpException(
        'Failed to trigger document ingestion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getIngestionStatus(documentId: string): Promise<IngestionStatus> {
    try {
      const numericDocId = parseInt(documentId, 10);
      const status = await this.ingestionStatusRepository.findOne({
        where: { documentId: numericDocId },
      });

      if (!status) {
        throw new HttpException('Ingestion status not found', HttpStatus.NOT_FOUND);
      }

      if (this.isStatusFinal(status.status)) {
        return status;
      }

      const pythonBackendUrl = this.configService.get<string>('PYTHON_BACKEND_URL');
      if (!pythonBackendUrl) {
        this.logger.warn('Python backend URL not configured, using local status');
        return status;
      }

      const response = await firstValueFrom(
        this.httpService.get<PythonResponse>(`${pythonBackendUrl}/status/${status.id}`).pipe(
          timeout(this.pythonBackendTimeout),
          catchError((error: AxiosError) => {
            this.logger.warn(`Failed to get status from Python backend: ${error.message}`);
            return of({
              data: {
                status: status.status,
                metadata: status.metadata,
              },
            });
          }),
        ),
      );

      if (response.data.status !== status.status) {
        const updatedStatus = await this.updateStatus(status.id, {
          status: response.data.status,
          metadata: {
            ...status.metadata,
            ...response.data.metadata,
            lastChecked: new Date().toISOString(),
          },
          error: response.data.error,
        });

        if (
          updatedStatus.status === IngestionStatusEnum.FAILED &&
          this.canRetry(updatedStatus)
        ) {
          return this.retryIngestion(updatedStatus);
        }

        return updatedStatus;
      }

      return status;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error checking status: ${(error as Error).message}`);
      throw new HttpException(
        'Failed to get ingestion status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isStatusFinal(status: IngestionStatusEnum): boolean {
    return status === IngestionStatusEnum.COMPLETED || 
           status === IngestionStatusEnum.FAILED;
  }

  private canRetry(status: IngestionStatus): boolean {
    return (status.metadata?.retryCount || 0) < this.maxRetries;
  }

  private async updateStatus(
    ingestionId: number,
    update: Partial<IngestionStatus>,
  ): Promise<IngestionStatus> {
    return this.ingestionStatusRepository.save({
      id: ingestionId,
      ...update,
      updatedAt: new Date(),
    });
  }

  async retryIngestion(status: IngestionStatus): Promise<IngestionStatus> {
    if (!this.canRetry(status)) {
      this.logger.warn(
        `Maximum retry attempts (${this.maxRetries}) reached for document ${status.documentId}`,
      );
      return status;
    }

    const retryCount = (status.metadata?.retryCount || 0) + 1;
    return this.updateStatus(status.id, {
      status: IngestionStatusEnum.PENDING,
      metadata: {
        ...status.metadata,
        retryCount,
        lastRetry: new Date().toISOString(),
      },
      error: null,
    });
  }
}