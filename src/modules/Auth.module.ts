import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/Auth.controller';
import { AuthService } from 'src/services/Auth.service';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [AuthService],
})
export class AuthModule {}
