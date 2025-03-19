import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { ConfigService } from '@nestjs/config';
import { CreateIngestionStatusDto } from './dto/create-ingestion-status.dto';
import { IngestionStatusRepository } from './repositories/ingestion-status.repository';
import * as amqp from 'amqplib';

@Injectable()
export class IngestionService implements OnModuleInit, OnModuleDestroy {
  private rabbitMqConnection: amqp.ChannelModel;
  private rabbitMqChannel: amqp.Channel;
  private readonly logger = new Logger(IngestionService.name);
  private readonly configService = new ConfigService();

  constructor(
    private readonly documentService: DocumentService,
    // private readonly configService: ConfigService,
    private readonly ingestionStatusRepository: IngestionStatusRepository,
  ) {}

  async onModuleInit() {
    await this.initializeRabbitMq();
  }

  async onModuleDestroy() {
    await this.closeRabbitMqConnection();
  }

  private async initializeRabbitMq() {
    try {
      const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
      
      if (!rabbitMqUrl) {
        throw new Error('RABBITMQ_URL is not defined in configuration');
      }
      
      // Connect to RabbitMQ and get a ChannelModel
      this.rabbitMqConnection = await amqp.connect(rabbitMqUrl);
      this.rabbitMqChannel = await this.rabbitMqConnection.createChannel();
      
      // Assert the queue exists
      await this.rabbitMqChannel.assertQueue('ingestion_queue', { durable: true });
      
      this.logger.log('Successfully connected to RabbitMQ');
      
      // Setup connection error handlers
      this.rabbitMqConnection.on('error', (err) => {
        this.logger.error(`RabbitMQ connection error: ${err.message}`);
        this.reconnectRabbitMq();
      });
      
      this.rabbitMqConnection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
        this.reconnectRabbitMq();
      });
    } catch (error:any) {
      this.logger.error(`Failed to initialize RabbitMQ: ${error.message}`);
      // Attempt to reconnect after a delay
      setTimeout(() => this.reconnectRabbitMq(), 5000);
    }
  }

  private async reconnectRabbitMq() {
    try {
      if (this.rabbitMqChannel) {
        await this.rabbitMqChannel.close().catch(() => {});
      }
      if (this.rabbitMqConnection) {
        await this.rabbitMqConnection.close().catch(() => {});
      }
    } catch (error:any) {
      this.logger.error(`Error closing RabbitMQ connections: ${error.message}`);
    }
    
    this.logger.log('Attempting to reconnect to RabbitMQ...');
    setTimeout(() => this.initializeRabbitMq(), 5000);
  }

  private async closeRabbitMqConnection() {
    try {
      if (this.rabbitMqChannel) {
        await this.rabbitMqChannel.close();
      }
      if (this.rabbitMqConnection) {
        await this.rabbitMqConnection.close();
      }
      this.logger.log('RabbitMQ connections closed');
    } catch (error:any) {
      this.logger.error(`Error closing RabbitMQ connections: ${error.message}`);
    }
  }

  async triggerIngestion(documentId: string): Promise<string> {
    try {
      // Create ingestion status record
      const ingestionStatus = new CreateIngestionStatusDto();
      ingestionStatus.documentId = documentId;
      ingestionStatus.status = 'pending';
      ingestionStatus.startedAt = new Date();
      await this.ingestionStatusRepository.createIngestionStatus(ingestionStatus);

      // Ensure we have a connection before sending
      if (!this.rabbitMqChannel) {
        await this.initializeRabbitMq();
      }

      // Send message to RabbitMQ queue
      this.rabbitMqChannel.sendToQueue(
        'ingestion_queue',
        Buffer.from(JSON.stringify({ documentId })),
        { persistent: true }
      );

      return `Ingestion triggered for document ${documentId}`;
    } catch (error:any) {
      this.logger.error(`Failed to trigger ingestion: ${error.message}`);
      throw new Error(`Failed to trigger ingestion: ${error.message}`);
    }
  }

  async getIngestionStatus(documentId: string): Promise<string> {
    try {
      const status = await this.ingestionStatusRepository.findOne({
        where: { documentId },
      });

      if (!status) {
        throw new Error('Ingestion not found');
      }

      return status.status;
    } catch (error:any) {
      throw new Error(`Failed to get ingestion status: ${error.message}`);
    }
  }

  async updateIngestionStatus(documentId: string, newStatus: string): Promise<void> {
    try {
      const status = await this.ingestionStatusRepository.findOne({
        where: { documentId },
      });

      if (status) {
        status.status = newStatus;
        status.updatedAt = new Date();
        await this.ingestionStatusRepository.save(status);
      }
    } catch (error:any) {
      throw new Error(`Failed to update ingestion status: ${error.message}`);
    }
  }
}