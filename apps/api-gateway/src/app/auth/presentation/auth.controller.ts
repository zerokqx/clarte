import { type Response } from 'express';
import { COOKIE_NAME, Marks } from '@clarte/shared';
import { Guard } from '@clarte/shared-nest';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectAuthClient, type IAuthClient } from '../aplication';
import { LoginDTO, LoginResponseDTO, RegisterDTO } from './dtos';
import { tap, map } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends Marks.Controller.Mixed {
  constructor(
    @InjectAuthClient()
    private readonly authClient: IAuthClient,
  ) {
    super();
  }

  @Post('validate')
  validate(@Body() body: any) {
    return this.authClient.validate(body);
  }

  @ApiOperation({ summary: 'Авторизоваться по логину и паролю' })
  @ApiOkResponse({ type: LoginResponseDTO })
  @Post('login')
  login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const source$ = this.authClient.login(body);
    return source$.pipe(
      tap(({ accessToken, refreshToken }) => {
        res.cookie(COOKIE_NAME.JWT_ACCESS, accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 3600000,
        });

        res.cookie(COOKIE_NAME.JWT_REFRESH, refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 3600000,
        });
      }),
      map(() => ({ success: true })),
    );
  }

  @ApiOperation({ summary: 'Зарегистрироваться по логину и паролю' })
  @ApiOkResponse({ description: 'Пользователь успешно зарегистрирован' })
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authClient.register(body);
  }

  @ApiOperation({ summary: 'Тестовый защищенный эндпоинт' })
  @UseGuards(Guard.AccessGuard)
  @Get('test-protected')
  testProtected(@Req() req: any) {
    return {
      message: 'Доступ разрешен',
      user: req.user,
    };
  }
}
