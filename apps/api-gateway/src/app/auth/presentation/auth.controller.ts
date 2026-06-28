import { Marks } from '@clarte/shared';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InjectAuthClient, type IAuthClient } from '@/app/auth/aplication';
import { LoginDTO, LoginResponseDTO, RegisterDTO } from '@/app/auth/presentation/dtos';
import { map } from 'rxjs';
import { AccessAuthGuard, AccessGuard, RefreshGuard } from '@clarte/shared-nest/guards';
import { JwtCookieInterceptor } from '@clarte/shared-nest/interceptors';
import { User, InjectCookieInterceptorUuid } from '@clarte/shared-nest/decorators';
import { type IAuthenticatedUser } from '@clarte/shared-contracts/interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends Marks.Controller.Mixed {
  constructor(
    @InjectAuthClient()
    private readonly authClient: IAuthClient,
    @InjectCookieInterceptorUuid()
    private readonly cookieInterceptorUuid: string,
  ) {
    super();
  }

  @ApiOperation({ summary: 'Авторизоваться по логину и паролю' })
  @ApiOkResponse({ type: LoginResponseDTO })
  @Post('login')
  @UseInterceptors(JwtCookieInterceptor)
  login(@Body() body: LoginDTO, @Headers('user-agent') userAgent = '') {
    return this.authClient.login({ ...body, userAgent }).pipe(
      map(({ accessToken, refreshToken }) => ({
        accessToken,
        refreshToken,
        __interceptorUuid: this.cookieInterceptorUuid,
      })),
    );
  }

  @ApiOperation({ summary: 'Зарегистрироваться по логину и паролю' })
  @ApiOkResponse({ description: 'Пользователь успешно зарегистрирован' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authClient.register(body);
  }

  @ApiOperation({ summary: 'Проверяет авторизован ли пользователь' })
  @ApiOkResponse({ description: 'Пользователь аунтетифицирован и авторизован' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @AccessGuard()
  @HttpCode(HttpStatus.OK)
  @Get('check')
  checkStatus() {
    return;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Производит обновление токенов access и refresh' })
  @ApiOkResponse({ description: 'Токены пользователя успешно обновлены' })
  @RefreshGuard()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(JwtCookieInterceptor)
  refresh(@User() user: IAuthenticatedUser) {
    return this.authClient
      .refresh({
        refreshToken: user.__metadata.original,
        userId: user.sub,
      })
      .pipe(
        map(({ accessToken, refreshToken }) => ({
          accessToken,
          refreshToken,
          __interceptorUuid: this.cookieInterceptorUuid,
        })),
      );
  }
}
