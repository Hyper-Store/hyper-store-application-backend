import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";
import { 
    RegisterServiceCreatedUsecase,
    UpdateServiceUsecase
 } from "./usecases";



@Injectable()
export class ServiceConsumerService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    @RabbitRPC({
        exchange: 'signature',
        routingKey: "SignatureCreatedEvent",
        queue: "register-signature-created-queue",
    })
    async register(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-service-created-queue",
            async (session) => 
            new RegisterServiceCreatedUsecase(session)
              .execute({
                    ...msg.payload
              })
          )
    }

    @RabbitRPC({
        exchange: 'signature',
        routingKey: "DaysAddedEvent",
        queue: "register-signature-days-added-queue",
    })
    async updateDays(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-signature-days-added-queue",
            async (session) => 
            new UpdateServiceUsecase(session)
              .execute({
                id: msg.payload.signatureId,

              })
          )
    }

    @RabbitRPC({
        exchange: 'signature',
        routingKey: "QuantityPerDayChangedEvent",
        queue: "register-signature-change-quantity-per-day-queue",
    })
    async updateQuantyPerDay(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-signature-change-quantity-per-day-queue",
            async (session) => 
            new UpdateServiceUsecase(session)
              .execute({
                id: msg.payload.signatureId
              })
          )
    }

}