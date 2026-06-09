import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.model';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { IUserRepository } from '../../application/contracts/user-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findUserById(id: string): Promise<User | null> {
    const rawUser = await this.userRepository.findOneBy({ id: id });
    if (!rawUser) return null;
    return UserMapper.toDomain(rawUser);
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const rawUser = await this.userRepository.findOneBy({ login });
    if (!rawUser) return null;
    return UserMapper.toDomain(rawUser);
  }

  async save(user: User): Promise<User> {
    const ormProps = UserMapper.fromDomainToOrm(user);
    const entityToSave = this.userRepository.create(ormProps);
    const userOrmEntity = await this.userRepository.save(entityToSave);
    return UserMapper.toDomain(userOrmEntity);
  }
}
