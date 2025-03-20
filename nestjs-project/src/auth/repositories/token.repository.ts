import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TokenRepository {
  private repository: Repository<TokenEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(TokenEntity);
  }

  async createToken(token: string, user: UserEntity, expiresAt: Date): Promise<void> {
    const tokenEntity = this.repository.create({ token, user, expiresAt });
    await this.repository.save(tokenEntity);
  }

  async isTokenValid(token: string): Promise<boolean> {
    const tokenEntity = await this.repository.findOne({ where: { token } });
    return !tokenEntity;
  }

  async invalidateToken(token: string): Promise<void> {
    await this.repository.delete({ token });
  }
}