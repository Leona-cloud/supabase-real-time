import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ChatModule } from './chat';
import { MessageModule } from './message';

@Module({
  imports: [AuthModule, ChatModule, MessageModule],
})
export class ApiModule {}
