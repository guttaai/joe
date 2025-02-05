import { Module } from '@nestjs/common';
import { TokenGateway } from './token.gateway';
import { TokenService } from './token.service';
import { TradeController } from './controllers/trade.controller';
import { PingController } from './controllers/ping.controller';

@Module({
    imports: [],
    controllers: [TradeController, PingController],
    providers: [TokenGateway, TokenService],
})
export class AppModule { } 