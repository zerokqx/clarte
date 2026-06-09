import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  login: string;

  @Column()
  passwordHash: string;

  @Column({ default: '' })
  avatarUrl: string;

  constructor(data: Partial<UserOrmEntity>) {
    Object.assign(this, data);
  }
}
