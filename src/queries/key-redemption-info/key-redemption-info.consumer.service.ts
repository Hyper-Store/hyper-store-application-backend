import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { BaseEvent } from "src/modules/@shared";
import { PrismaIdpotenceConsumerService } from "src/modules/@shared/services";
import { ProcessKeyRedemptionInfoUsecase } from "./usecases";


@Injectable()
export class KeyRedemptionInfoConsumerService {

    constructor(
        private readonly prismaIdpotenceConsumerService: PrismaIdpotenceConsumerService,

    ){}

    @RabbitRPC({
        exchange: 'signature',
        routingKey: "DaysAddedEvent",
        queue: "proccess-key-redemption-info-queue",
    })
    async proccess(msg: BaseEvent.Schema){
        await this.prismaIdpotenceConsumerService.consume(
            msg.id,
            "proccess-key-redemption-info-queue",
            async (prisma) => 
            new ProcessKeyRedemptionInfoUsecase(prisma)
              .execute({
                    signatureId: msg.payload.signatureId,
                    daysAdded: msg.payload.daysAdded
              })
          )
    }
}