import { Module } from '@nestjs/common';
import { TokenGateway } from './token.gateway';
import { TokenService } from './token.service';

@Module({
    imports: [],
    providers: [TokenGateway, TokenService],
})
export class AppModule { } 