import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PumpFunOperator } from './operators/PumpFunOperator';
import { CONFIG } from './config';
import { TokenMetadata } from './types/tokenMetadata';

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy
{
    private operator: PumpFunOperator;
    private clients: Set<any> = new Set();

    constructor()
    {
        this.operator = new PumpFunOperator(CONFIG.PUMP_FUN_WS_URL);
        this.setupEventListeners();
    }

    async onModuleInit()
    {
        await this.operator.start();
    }

    async onModuleDestroy()
    {
        await this.operator.stop();
    }

    private setupEventListeners(): void
    {
        this.operator.on('tokenReceived', (token: TokenMetadata) =>
        {
            this.broadcastToken(token);
        });
    }

    private broadcastToken(token: TokenMetadata)
    {
        this.clients.forEach(client =>
        {
            client.emit('newToken', token);
        });
    }

    addClient(client: any)
    {
        this.clients.add(client);
    }

    removeClient(client: any)
    {
        this.clients.delete(client);
    }
} 