import { PumpFunOperator } from './operators/PumpFunOperator';
// import { ConnectionStatus } from './types/events';
import { ConnectionStatus } from '@guttaai/core';
import { TokenMetadata } from './types/tokenMetadata';
import { CONFIG } from './config';

class Console
{
    private operator: PumpFunOperator;

    constructor()
    {
        this.operator = new PumpFunOperator(CONFIG.PUMP_FUN_WS_URL);
        this.setupEventListeners();
    }

    private setupEventListeners(): void
    {
        this.operator.on('connectionStatus', (status: ConnectionStatus) =>
        {
            console.log(`Connection status: ${status}`);
        });

        this.operator.on('error', (error: Error) =>
        {
            console.error('Error:', error.message);
        });

        this.operator.on('tokenReceived', (token: TokenMetadata) =>
        {
            this.processToken(token);
        });
    }

    private processToken(token: TokenMetadata): void
    {
        console.log('\nNew Token Created:');
        console.log('------------------');
        console.log(JSON.stringify(token, null, 2));
        console.log('------------------\n');
    }

    public async start(): Promise<void>
    {
        console.log('Starting pump.fun token monitor...');
        await this.operator.start();
    }

    public async stop(): Promise<void>
    {
        console.log('Stopping token monitor...');
        await this.operator.stop();
    }
}

// Create and start the console
const consoleApp = new Console();
consoleApp.start();

// Handle graceful shutdown
process.on('SIGINT', async () =>
{
    await consoleApp.stop();
    process.exit();
}); 