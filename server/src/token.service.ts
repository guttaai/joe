import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PumpFunOperator } from './operators/PumpFunOperator';
import { CONFIG } from './config';
import { TokenMetadata } from './types/tokenMetadata';
import { WebSocket } from 'ws';

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy
{
    private operator: PumpFunOperator;
    private clients: Set<WebSocket> = new Set();

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
        const message = JSON.stringify({ type: 'newToken', data: token });
        this.clients.forEach(client =>
        {
            if (client.readyState === WebSocket.OPEN)
            {
                client.send(message);
            }
        });
    }

    addClient(client: WebSocket)
    {
        this.clients.add(client);
    }

    removeClient(client: WebSocket)
    {
        this.clients.delete(client);
    }
} 