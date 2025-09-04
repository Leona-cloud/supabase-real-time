import { Module } from '@nestjs/common';
import { MessageService } from './services';
import { MessageController } from './controllers';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
