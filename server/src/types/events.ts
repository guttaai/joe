export enum ConnectionStatus
{
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

export interface TokenData
{
    name: string;
    symbol: string;
    mint: string;
    uri: string;
    pumpFunUrl: string;
}

export interface OperatorEvents
{
    connectionStatus: (status: ConnectionStatus) => void;
    error: (error: Error) => void;
    tokenReceived: (token: TokenData) => void;
} 