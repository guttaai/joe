import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PumpFunOperator } from './operators/PumpFunOperator';
import { CONFIG } from './config';
import { TokenMetadata } from './types/tokenMetadata';
import { WebSocket } from 'ws';
import { SocialLinksAlgorithm } from './algorithms/SocialLinksAlgorithm';
import { AlgorithmResult } from './core/algorithms/BaseAlgorithm';

interface TokenWithAlgorithms extends TokenMetadata
{
    algorithmResults?: AlgorithmResult[];
}

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy
{
    private operator: PumpFunOperator;
    private clients: Set<WebSocket> = new Set();
    private algorithms = [
        new SocialLinksAlgorithm()
    ];

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

    private async processAlgorithms(token: TokenMetadata): Promise<TokenWithAlgorithms>
    {
        const results = await Promise.all(
            this.algorithms.map(algo => algo.execute(token))
        );

        // Set send status based on critical checks
        const hasFailedCriticalChecks = results.some(result => result.criticalCheckFailed);
        const send = !hasFailedCriticalChecks; // We can send if no critical checks failed

        return {
            ...token,
            send,
            algorithmResults: results
        };
    }

    private async broadcastToken(token: TokenMetadata)
    {
        const processedToken = await this.processAlgorithms(token);
        const message = JSON.stringify({
            type: 'newToken',
            data: processedToken
        });

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