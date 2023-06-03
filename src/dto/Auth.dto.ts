import { IsString } from 'class-validator';

export class LoginOutputDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
