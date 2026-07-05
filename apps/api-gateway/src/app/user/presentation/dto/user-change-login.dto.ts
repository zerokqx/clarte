import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserChangeLoginDTO {
  @ApiProperty({ description: 'Новый логин пользователя', example: 'new_login' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  login!: string;
}
