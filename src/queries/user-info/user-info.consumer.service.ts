import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";
import { 
    RegisterUserInfoUsecase
 } from "./usecases";



@Injectable()
export class StockUserInfoConsumerService {

    constructor(
    ){}

    @RabbitRPC({
        exchange: 'auth',
        routingKey: "UserCreatedEvent",
        queue: "register-user-info-queue",
    })
    async register(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-user-info-queue",
            async (session) => 
            new RegisterUserInfoUsecase(session)
              .execute({
                    ...msg.payload,
                    password: undefined,
                    isBanned: undefined
              })
          )
    }



}