import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/Auth.controller';
import { AuthService } from 'src/services/Auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
