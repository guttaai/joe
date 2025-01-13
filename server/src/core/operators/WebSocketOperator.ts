import { BaseOperator } from './BaseOperator';
import WebSocket from 'ws';
import { ConnectionStatus } from '../../types/events';

export abstract class WebSocketOperator extends BaseOperator
{
    protected ws: WebSocket | null = null;
    protected url: string;
    protected reconnectTimeout: number = 5000;

    constructor(url: string)
    {
        super();
        this.url = url;
    }

    protected setupWebSocket(): void
    {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () =>
        {
            this.emit('connectionStatus', ConnectionStatus.CONNECTED);
            this.onConnectionOpen();
        });

        this.ws.on('message', (data: WebSocket.Data) =>
        {
            this.onMessage(data);
        });

        this.ws.on('close', () =>
        {
            this.emit('connectionStatus', ConnectionStatus.DISCONNECTED);
            if (this.isRunning)
            {
                setTimeout(() => this.setupWebSocket(), this.reconnectTimeout);
            }
        });

        this.ws.on('error', (error: Error) =>
        {
            this.emit('error', error);
            this.ws?.close();
        });
    }

    protected abstract onConnectionOpen(): void;
    protected abstract onMessage(data: WebSocket.Data): void;

    async start(): Promise<void>
    {
        this.isRunning = true;
        this.setupWebSocket();
    }

    async stop(): Promise<void>
    {
        this.isRunning = false;
        if (this.ws)
        {
            this.ws.close();
            this.ws = null;
        }
    }
} 