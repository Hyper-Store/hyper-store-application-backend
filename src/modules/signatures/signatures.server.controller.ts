import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { 
  AddDaysUsecase,
  ChangeQuantityPerDayUsecase
} from './usecases';
import { PrismaIdpotenceConsumerService } from '../@shared/services';

@Controller('signatures')
export class SignaturesController {
  constructor(
    private readonly prismaIdpotenceConsumerService: PrismaIdpotenceConsumerService,
    private readonly prismaService: PrismaService
  ) {}

  @RabbitRPC({
    exchange: 'keyRedemption',
    routingKey: "RedeemKeyProcessedEvent",
    queue:  "add-days-to-signature-queue"
  })
  async consumer(msg: BaseEvent.Schema) {
      const addDaysUsecase = new AddDaysUsecase(
        this.prismaService,
        "RedeemKeyProcessedEvent",
        msg.id
      )
      await addDaysUsecase.execute({
          days: msg.payload.validUntil,
          serviceId: msg.payload.serviceId,
          userId: msg.payload.keyRedeemerId
      })
  }

  @RabbitRPC({
    exchange: 'keyRedemption',
    routingKey: "RedeemKeyProcessedEvent",
    queue:  "change-quantity-per-day-signature-queue"
  })
  async changeQuantityPerDay(msg: BaseEvent.Schema) {
    await this.prismaIdpotenceConsumerService.consume(
      msg.id,
      "change-quantity-per-day-signature-queue",
      async (prisma) => 
      new ChangeQuantityPerDayUsecase(prisma)
        .execute({
          quantityPerDay: msg.payload.quantityPerDay ?? 1,
          serviceId: msg.payload.serviceId,
          userId: msg.payload.keyRedeemerId
        })
    )

  }
}
