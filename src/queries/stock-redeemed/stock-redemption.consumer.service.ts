import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";
import { 
    RegisterStockRedeemedUsecase
 } from "./usecases";



@Injectable()
export class StockRedemptionConsumerService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    @RabbitRPC({
        exchange: 'stockRedemption',
        routingKey: "StockRedeemedEvent",
        queue: "register-stock-redeemed-queue",
    })
    async register(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-stock-redeemed-queue",
            async (session) => 
            new RegisterStockRedeemedUsecase(session)
              .execute({
                    ...msg.payload,
                    dateTimeRedeemed: new Date(msg.payload.dateTimeRedeemed)
              })
          )
    }



}