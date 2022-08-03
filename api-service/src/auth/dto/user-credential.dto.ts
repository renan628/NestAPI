import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCredentialDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class EmailDTO extends OmitType(UserCredentialDTO, [
  'password',
] as const) {}
