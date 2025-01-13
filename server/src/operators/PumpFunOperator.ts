import { WebSocketOperator } from '../core/operators/WebSocketOperator';
import { TokenData } from '../types/events';
import WebSocket from 'ws';

export class PumpFunOperator extends WebSocketOperator
{
    protected onConnectionOpen(): void
    {
        const subscribeMsg = {
            method: "subscribeNewToken"
        };
        this.ws?.send(JSON.stringify(subscribeMsg));
    }

    protected onMessage(data: WebSocket.Data): void
    {
        try
        {
            const message = JSON.parse(data.toString()) as TokenData;
            this.emit('tokenReceived', message);
        } catch (error)
        {
            this.emit('error', new Error(`Failed to parse message: ${error}`));
        }
    }
} 