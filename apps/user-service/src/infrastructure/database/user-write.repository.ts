import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '@/infrastructure/database/user.entity';
import { IUserWriteRepository } from '@/application/ports/user-repository.interface';
import { User } from '@/domain/user.model';
import { UserMapper } from '@/infrastructure/mappers/user.mapper';

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

  async findUserById(id: string): Promise<User> {
    const userFromDb = await this.userRepository.findOneOrFail({
      where: { id },
    });
    return UserMapper.toDomain(userFromDb);
  }
}
