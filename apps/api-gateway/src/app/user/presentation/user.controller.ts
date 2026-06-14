import { Marks } from '@clarte/shared';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { InjectUserClient, type IUserClient } from '../application';
import { UserFindDTO } from './dto';

@Controller('users')
export class UserController extends Marks.Controller.Private {
  constructor(
    @InjectUserClient()
    private readonly userClient: IUserClient,
  ) {
    super();
  }

  @ApiOperation({
    summary: 'Получить пользователя по ID',
    description:
      'Возвращает информацию о пользователе по его уникальному идентификатору',
  })
  @ApiOkResponse({ type: UserFindDTO })
  @Get('id/:id')
  findUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Observable<UserFindDTO> {
    return this.userClient.findUserById(id).pipe(
      map(
        (raw) =>
          new UserFindDTO({
            id: raw.id,
            login: raw.login,
            avatarUrl: raw.avatarUrl,
          }),
      ),
    );
  }

  @Get('login/:login')
  @ApiOkResponse({ type: UserFindDTO })
  @ApiOperation({ summary: 'Получить пользователя по логину' })
  findUserByLogin(@Param('login') login: string): Observable<UserFindDTO> {
    return this.userClient.findUserByLogin(login).pipe(
      map(
        (raw) =>
          new UserFindDTO({
            id: raw.id,
            login: raw.login,
            avatarUrl: raw.avatarUrl,
          }),
      ),
    );
  }
}
