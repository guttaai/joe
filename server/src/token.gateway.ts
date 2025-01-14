import
{
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from './token.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    transports: ['websocket'],
    namespace: '/',
    path: '/socket.io/',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000
})
export class TokenGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    private server!: Server;

    constructor(private tokenService: TokenService) { }

    afterInit(server: Server)
    {
        this.server = server;
    }

    handleConnection(client: Socket)
    {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket)
    {
        console.log(`Client disconnected: ${client.id}`);
    }
} 