import { Marks } from '@clarte/shared';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectAuthClient, type IAuthClient } from '@/app/auth/aplication';
import {
  LoginDTO,
  LoginResponseDTO,
  RegisterDTO,
} from '@/app/auth/presentation/dtos';
import { map } from 'rxjs';
import { Guard, User, Interceptors, InjectCookieInterceptorUuid } from '@clarte/shared-nest';
import { type IAuthenticatedUser } from '@clarte/shared-contracts';

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
  @UseInterceptors(Interceptors.JwtCookieInterceptor)
  login(@Body() body: LoginDTO) {
    return this.authClient.login(body).pipe(
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

  @Post('refresh')
  @ApiOperation({ summary: 'Производит обновление токенов access и refresh' })
  @ApiOkResponse({ description: 'Токены пользователя успешно обновлены' })
  @Guard.RefreshGuard()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(Interceptors.JwtCookieInterceptor)
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
