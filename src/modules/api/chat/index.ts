import { Module } from "@nestjs/common";
import { ChatService } from "./services";
import { ChatController } from "./controllers";



@Module({
    providers: [ChatService],
    controllers: [ChatController]
})

export class ChatModule{}