import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";
import { RegisterSignatureCreatedUsecase } from "./usecases";
import { UpdateSignatureUsecase } from "./usecases/update-signature/update-signature.usecase";



@Injectable()
export class SignaturesConsumerService {

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
            "register-signature-created-queue",
            async (session) => 
            new RegisterSignatureCreatedUsecase(this.prismaService, session)
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
            new UpdateSignatureUsecase(this.prismaService, session)
              .execute({
                id: msg.payload.signatureId,
                expirationDate: msg.payload.expirationDate,
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
            new UpdateSignatureUsecase(this.prismaService, session)
              .execute({
                id: msg.payload.signatureId,
                quantityPerDay: msg.payload.quantityPerDay,
              })
          )
    }

}