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
        exchange: 'services',
        routingKey: "ServiceCreatedEvent",
        queue: "register-service-created-queue",
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
        exchange: 'services',
        routingKey: "MaintananceSetEvent",
        queue: "register-signature-set-maintenance-queue",
    })
    async updateDays(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
            "register-signature-set-maintenance-queue",
            async (session) => 
            new UpdateServiceUsecase(session)
              .execute({
                id: msg.payload.serviceId,
                isMaintenance: true
              })
          )
    }

    @RabbitRPC({
        exchange: 'services',
        routingKey: "MaintananceRemovedEvent",
        queue: "register-signature-remove-maintenance-queue",
    })
    async updateQuantyPerDay(msg: BaseEvent.Schema){
        await MongoIdpotenceConsumerService.consume(
            msg.id,
             "register-signature-remove-maintenance-queue",
            async (session) => 
            new UpdateServiceUsecase(session)
              .execute({
                id: msg.payload.serviceId,
                isMaintenance: false
              })
          )
    }

}