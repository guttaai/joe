import { PumpFunOperator } from './operators/PumpFunOperator';
import { ConnectionStatus, TokenData } from './types/events';
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

        this.operator.on('tokenReceived', (token: TokenData) =>
        {
            console.log(token.pumpFunUrl);
        });
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