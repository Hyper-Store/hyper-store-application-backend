import { Global, Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketConnectionsService } from './websocket-connections.service';
import { WebsocketInfoController } from './websocket-info.controller';


@Global()
@Module({
  controllers: [
    WebsocketInfoController
  ],
  providers: [
    WebsocketController,
    WebsocketConnectionsService
  ],
    exports: [
        WebsocketConnectionsService
    ]
})
export class WebsocketModule {}
