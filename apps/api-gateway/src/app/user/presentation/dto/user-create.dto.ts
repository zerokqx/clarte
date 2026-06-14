import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';
export class UserCreateDTO {
  @IsString()
  @ApiProperty()
  readonly login!: string;

  @IsStrongPassword()
  @ApiProperty()
  readonly password!: string;
}
