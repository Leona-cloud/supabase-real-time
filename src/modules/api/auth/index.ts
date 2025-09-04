import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';

@Module({
  imports: [],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
