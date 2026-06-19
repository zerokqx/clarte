import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'user' })
  @Length(1, 30)
  @IsString()
  readonly login!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(6)
  readonly password!: string;
}
