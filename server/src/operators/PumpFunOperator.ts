import { WebSocketOperator } from '../core/operators/WebSocketOperator';
import { TokenData } from '../types/events';
import WebSocket from 'ws';

interface TokenCreationMessage
{
    message?: string;
    mint: string;
    name: string;
    symbol: string;
    uri: string;
}

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
            const message = JSON.parse(data.toString()) as TokenCreationMessage;

            // Ignore subscription confirmation message
            if (message.message === "Successfully subscribed to token creation events.")
            {
                return;
            }

            // For token creation messages
            if (message.mint)
            {
                const tokenData: TokenData = {
                    name: message.name,
                    symbol: message.symbol,
                    mint: message.mint,
                    uri: message.uri,
                    pumpFunUrl: `https://pump.fun/coin/${message.mint}`
                };
                this.emit('tokenReceived', tokenData);
            }
        } catch (error)
        {
            this.emit('error', new Error(`Failed to parse message: ${error}`));
        }
    }
} 