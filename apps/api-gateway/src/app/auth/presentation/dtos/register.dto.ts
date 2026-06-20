import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ example: 'user' })
  @IsString()
  readonly login!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(6)
  readonly password!: string;
}
