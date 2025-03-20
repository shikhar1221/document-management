
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, OneToMany, ManyToMany } from 'typeorm';
import { Role } from '../../auth/roles.enum';
import { TokenEntity } from '../../auth/entities/token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({type: 'enum', enum: Role, array:true, default: [Role.Viewer]})
  roles: Role[];

  @OneToMany(() => TokenEntity, token => token.user)
  tokens: TokenEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
