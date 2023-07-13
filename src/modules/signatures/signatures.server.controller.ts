import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { AddDaysUsecase } from './usecases';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly prismaService: PrismaService) {}

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
}
