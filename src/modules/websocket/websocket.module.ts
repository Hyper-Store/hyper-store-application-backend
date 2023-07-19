import { Global, Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketConnectionsService } from './websocket-connections.service';


@Global()
@Module({
  controllers: [],
  providers: [
    WebsocketController,
    WebsocketConnectionsService
  ],
    exports: [
        WebsocketConnectionsService
    ]
})
export class WebsocketModule {}
