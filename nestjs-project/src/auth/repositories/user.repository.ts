// nestjs-project/src/auth/user.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ where: { email } });
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.create(user);
    return this.save(newUser);
  }
}