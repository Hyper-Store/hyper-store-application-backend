import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessRedeemKeyUsecase } from './usecases';
import { BaseEvent } from '../@shared';

@Injectable()
export class KeyRedemptionService {
    
    static consumerName = "process-key-redemption-queue"

    constructor(
        private readonly prismaService: PrismaService
    ){}

    @RabbitRPC({
        exchange: 'key',
        routingKey: "KeyRedeemedEvent",
        queue:  KeyRedemptionService.consumerName
    })
    async consumer(msg: BaseEvent.Schema) {
        const processRedeemKeyUsecase = new ProcessRedeemKeyUsecase(
            this.prismaService,
            "KeyRedeemedEvent",
            msg.id
        )
        await processRedeemKeyUsecase.execute({
            key: msg.payload.key
        })
    }
}
