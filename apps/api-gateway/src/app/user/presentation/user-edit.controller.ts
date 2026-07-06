import { Marks } from '@clarte/shared';
import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { InjectUserClient, type IUserClient } from '@/app/user/application';
import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { AccessGuard } from '@clarte/shared-nest/guards';
import { User } from '@clarte/shared-nest/decorators';
import { UserChangeAvatarDTO, UserChangeLoginDTO } from './dto';

@Controller('users')
export class UserEditController extends Marks.Controller.Private {
  constructor(
    @InjectUserClient()
    private readonly userClient: IUserClient,
  ) {
    super();
  }

  @Patch('change-avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AccessGuard()
  @ApiOperation({ summary: 'Изменить аватар пользователя' })
  @ApiNoContentResponse({ description: 'Аватар успешно изменен' })
  changeAvatar(@User() user: IJwtPayload, @Body() dto: UserChangeAvatarDTO): Observable<void> {
    return this.userClient.userChangeAvatar({
      userId: user.sub,
      avatarUrl: dto.avatarUrl,
    });
  }

  @Patch('change-login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AccessGuard()
  @ApiOperation({ summary: 'Изменить логин пользователя' })
  @ApiNoContentResponse({ description: 'Логин успешно изменен' })
  changeLogin(@User() user: IJwtPayload, @Body() dto: UserChangeLoginDTO): Observable<void> {
    return this.userClient.userChangeLogin({
      userId: user.sub,
      login: dto.login,
    });
  }
}
