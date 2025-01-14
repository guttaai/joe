import { WebSocketOperator } from '../core/operators/WebSocketOperator';
import { TokenData, ConnectionStatus } from '../types/events';
import WebSocket from 'ws';
import { TokenMetadata } from '../types/tokenMetadata';

export class PumpFunOperator extends WebSocketOperator
{
    private hasSubscribed: boolean = false;

    protected setupWebSocket(): void
    {
        this.ws = new WebSocket(this.url, {
            perMessageDeflate: true,
            handshakeTimeout: 10000,
            headers: {
                'Origin': 'https://pump.fun',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-WebSocket-Extensions': 'permessage-deflate'
            }
        });

        this.ws.on('open', () =>
        {
            console.log('WebSocket connected, sending NATS credentials...');
            const connectMsg = {
                no_responders: true,
                protocol: 1,
                verbose: false,
                pedantic: false,
                user: "subscriber",
                pass: "lW5a9y20NceF6AE9",
                lang: "nats.ws",
                version: "1.29.2",
                headers: true
            };

            const msg = `CONNECT ${JSON.stringify(connectMsg)}\r\nPING\r\n`;
            console.log('Sending:', msg);
            this.ws?.send(msg);
            this.emit('connectionStatus', ConnectionStatus.CONNECTED);
        });

        this.ws.on('message', (data: WebSocket.Data) =>
        {
            try
            {
                const message = data.toString();
                console.log('Received:', message);

                if (message.includes('PONG') && !this.hasSubscribed)
                {
                    const subMsg = 'SUB newCoinCreated.prod 1\r\n';
                    console.log('Sending:', subMsg);
                    this.ws?.send(subMsg);
                    this.hasSubscribed = true;
                    console.log('Subscribed to: newCoinCreated.prod');
                } else if (message.includes('PING'))
                {
                    const pongMsg = 'PONG\r\n';
                    console.log('Sending:', pongMsg);
                    this.ws?.send(pongMsg);
                } else if (message.includes('MSG'))
                {
                    const jsonStart = message.indexOf('{');
                    if (jsonStart !== -1)
                    {
                        const jsonData = JSON.parse(message.slice(jsonStart));

                        const tokenData: TokenMetadata = {
                            mint: jsonData.mint,
                            twitter: jsonData.twitter || null,
                            telegram: jsonData.telegram || null,
                            website: jsonData.website || null
                        };

                        this.emit('tokenReceived', tokenData);
                    }
                }
            } catch (error)
            {
                this.emit('error', new Error(`Failed to process message: ${error}`));
            }
        });

        this.ws.on('close', () =>
        {
            this.hasSubscribed = false;
            this.emit('connectionStatus', ConnectionStatus.DISCONNECTED);
            if (this.isRunning)
            {
                setTimeout(() => this.setupWebSocket(), 5000);
            }
        });

        this.ws.on('error', (error: Error) =>
        {
            this.emit('error', error);
            this.ws?.close();
        });
    }

    protected onConnectionOpen(): void
    {
        // Moved to setupWebSocket
    }

    protected onMessage(data: WebSocket.Data): void
    {
        // Moved to setupWebSocket
    }
} 