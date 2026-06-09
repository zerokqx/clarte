import { Marks } from '@clarte/shared';
import { Controller, Get, Param } from '@nestjs/common';
import { UserFindService } from '../application/user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UserController extends Marks.Controller.Private {
  constructor(private readonly userFindService: UserFindService) {
    super();
  }

  @ApiOperation({
    summary: 'Получить пользователя по ID',
    description:
      'Возвращает информацию о пользователе по его уникальному идентификатору',
  })
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userFindService.findUserById(id);
  }
}
