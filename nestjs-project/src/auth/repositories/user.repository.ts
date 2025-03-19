import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../../userManagement/entities/user.entity';
import { UpdateUserDto } from '../../userManagement/dto/update-user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ where: { email } });
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.create(user);
    return this.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.find({ where: { isDeleted: false } });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return this.findOne({ where: { id: parseInt(id), isDeleted: false } });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Merge the updateUserDto with the existing user
    const updatedUser = this.merge(user, updateUserDto);
    return this.save(updatedUser).then(() => ({ raw: {}, generatedMaps: [] }));
  }

  async removeUser(id: string): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const res=this.remove(user);
    return res;
  }
}