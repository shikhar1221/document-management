import { EntityRepository, Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {
  async invalidateToken(token: string, user: UserEntity, expiresAt: Date): Promise<void> {
    const tokenEntity = this.create({ token, user, expiresAt });
    await this.save(tokenEntity);
  }

  async isTokenValid(token: string): Promise<boolean> {
    const tokenEntity = await this.findOne({ where: { token } });
    return !tokenEntity;
  }
}