import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.entity';
import { IUserWriteRepository } from '../../application/ports/user-repository.interface';
import { User } from '../../domain/user.model';
import { UserMapper } from '../mappers/user.mapper';

export class UserWriteRepository implements IUserWriteRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const ormProps = UserMapper.fromDomainToOrm(user);
    const entityToSave = this.userRepository.create(ormProps);
    const userOrmEntity = await this.userRepository.save(entityToSave);
    return UserMapper.toDomain(userOrmEntity);
  }
}
