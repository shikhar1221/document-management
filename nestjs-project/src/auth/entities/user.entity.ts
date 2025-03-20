import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DocumentEntity } from '../../document/entities/document.entity';
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

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.Viewer] })
  roles: Role[];

  @OneToMany(() => TokenEntity, token => token.user)
  tokens: TokenEntity[];

  @OneToMany(() => DocumentEntity, document => document.user)
  documents: DocumentEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
