import { WebSocketServer } from 'ws';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class TokenGateway implements OnModuleInit
{
    private wsServer!: WebSocketServer;

    constructor(private readonly tokenService: TokenService) { }

    onModuleInit()
    {
        this.wsServer = new WebSocketServer({
            port: Number(process.env.WS_PORT) || 2050,
            verifyClient: (info, callback) =>
            {
                const origin = info.origin || info.req.headers.origin;
                callback(true);
            }
        });
        console.log('WebSocket Gateway initialized on port:', process.env.WS_PORT || 2050);

        this.wsServer.on('connection', (socket) =>
        {
            console.log('Client connected');

            this.tokenService.addClient(socket);

            socket.on('close', () =>
            {
                console.log('Client disconnected');
                this.tokenService.removeClient(socket);
            });

            socket.on('error', (error) =>
            {
                console.error('WebSocket error:', error);
            });
        });
    }
} 