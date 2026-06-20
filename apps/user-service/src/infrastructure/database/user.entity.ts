import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 30 })
  login!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ default: '', name: 'avatar_url' })
  avatarUrl!: string;

  constructor(data: Partial<UserOrmEntity>) {
    Object.assign(this, data);
  }
}
