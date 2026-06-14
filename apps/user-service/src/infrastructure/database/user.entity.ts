import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 30 })
  login!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: '' })
  avatarUrl!: string;

  constructor(data: Partial<UserOrmEntity>) {
    Object.assign(this, data);
  }
}
