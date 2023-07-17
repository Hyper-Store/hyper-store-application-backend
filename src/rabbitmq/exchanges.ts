import {  RabbitMQExchangeConfig } from "@golevelup/nestjs-rabbitmq";

export const exchanges: RabbitMQExchangeConfig[] = [
    { name: "eventSourcing", type: "fanout" },
    { name: "auth", type: "topic" },
    { name: "key", type: "topic" },
    { name: "keyRedemption", type: "topic" },
    { name: "services", type: "topic" },
    { name: "signature", type: "topic" },
    { name: "userSession", type: "topic" },
    { name: "notification", type: "topic" }
]