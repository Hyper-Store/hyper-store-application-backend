import {  RabbitMQExchangeConfig } from "@golevelup/nestjs-rabbitmq";

export const exchanges: RabbitMQExchangeConfig[] = [
    { name: "auth", type: "topic" },
    { name: "eventSourcing", type: "fanout" }
]