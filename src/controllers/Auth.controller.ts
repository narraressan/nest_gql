import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LoginOutputDto } from 'src/dto/Auth.dto';
import { AuthService } from 'src/services/Auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authorize')
  async authorize(@Query('code') code: string): Promise<LoginOutputDto> {
    return await this.authService.authorize(code);
  }
}
