
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, OneToMany } from 'typeorm';
import { Role } from '../roles.enum';
import { TokenEntity } from './token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinTable()
  roles: Role[];

  @OneToMany(() => TokenEntity, token => token.user)
  tokens: TokenEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
