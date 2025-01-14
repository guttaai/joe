import WebSocket from 'ws';

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 40000;

export class WebSocketClient
{
    url: string;
    eventType: string;
    callback: (data: any) => void;
    socket: WebSocket | null;

    constructor(eventType: string, callback: (data: any) => void)
    {
        this.url = 'wss://prod-v2.nats.realtime.pump.fun/';
        this.eventType = eventType;
        this.callback = callback;
        this.socket = null;
    }

    connect(): void
    {
        console.log(`Attempting to connect to ${this.url}`);
        this.socket = new WebSocket(this.url, {
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

        this.socket.onmessage = (event) =>
        {
            const message = event.data.toString();
            console.log('Received:', message);

            if (message.includes('PONG'))
            {
                // After getting PONG, subscribe to the event
                const subMsg = `SUB ${this.eventType}.prod 1\r\n`;
                console.log('Sending:', subMsg);
                this.socket?.send(subMsg);
                console.log('Subscribed to:', `${this.eventType}.prod`);
            } else if (message.includes('PING'))
            {
                // Respond to server PINGs with PONG
                const pongMsg = 'PONG\r\n';
                console.log('Sending:', pongMsg);
                this.socket?.send(pongMsg);
            } else if (message.includes('MSG'))
            {
                try
                {
                    // Extract the JSON payload from MSG format
                    const jsonStart = message.indexOf('{');
                    const payload = JSON.parse(message.slice(jsonStart));
                    this.callback(payload);
                } catch (error)
                {
                    console.error('Error processing message:', error);
                }
            }
        };

        this.socket.onopen = () =>
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

            // Make sure CONNECT and PING are properly formatted
            const msg = `CONNECT ${JSON.stringify(connectMsg)}\r\nPING\r\n`;
            console.log('Sending:', msg.replace(/\r\n/g, '\\r\\n'));
            this.socket?.send(msg);
        };

        this.socket.onerror = (error) =>
        {
            console.error('Connection error:', error);
        };

        this.socket.onclose = (event) =>
        {
            console.log(`Disconnected: ${event.reason}`);
        };
    }

    subscribeToEvent(): void
    {
        if (this.socket && this.socket.readyState === WebSocket.OPEN)
        {
            const subscribeMessage = `42${JSON.stringify(['subscribe', {
                event: this.eventType
            }])}`;
            this.socket.send(subscribeMessage);
            console.log(`Subscribed to ${this.eventType}`);
        } else
        {
            console.log('Socket not connected, unable to subscribe');
        }
    }

    parseNewCoinCreatedData(rawData: any)
    {
        try
        {
            const jsonData = JSON.parse(rawData.data.subscribe.data);
            return {
                mint: jsonData.payload.mint,
                name: jsonData.payload.name,
                symbol: jsonData.payload.symbol,
                description: jsonData.payload.description,
                image_uri: jsonData.payload.image_uri,
                metadata_uri: jsonData.payload.metadata_uri,
                twitter: jsonData.payload.twitter,
                telegram: jsonData.payload.telegram,
                bonding_curve: jsonData.payload.bonding_curve,
                associated_bonding_curve: jsonData.payload.associated_bonding_curve,
                creator: jsonData.payload.creator,
                raydium_pool: jsonData.payload.raydium_pool,
                virtual_sol_reserves: jsonData.payload.virtual_sol_reserves,
                virtual_token_reserves: jsonData.payload.virtual_token_reserves,
                hidden: jsonData.payload.hidden,
                total_supply: jsonData.payload.total_supply,
                website: jsonData.payload.website,
                show_name: jsonData.payload.show_name,
                last_trade_timestamp: jsonData.payload.last_trade_timestamp,
                king_of_the_hill_timestamp: jsonData.payload.king_of_the_hill_timestamp,
                market_cap: jsonData.payload.market_cap,
                nsfw: jsonData.payload.nsfw,
                market_id: jsonData.payload.market_id,
                inverted: jsonData.payload.inverted,
                real_sol_reserves: jsonData.payload.real_sol_reserves,
                livestream_ban_expiry: jsonData.payload.livestream_ban_expiry,
                last_reply: jsonData.payload.last_reply,
                reply_count: jsonData.payload.reply_count,
                is_banned: jsonData.payload.is_banned,
                is_currently_live: jsonData.payload.is_currently_live,
                initialized: jsonData.payload.initialized,
                usd_market_cap: jsonData.payload.usd_market_cap,
                created_timestamp: jsonData.payload.created_timestamp,
            };
        } catch (error)
        {
            console.error('Error parsing newCoinCreated data:', error);
            return rawData;
        }
    }

    disconnect(): void
    {
        console.log('Disconnecting socket');
        if (this.socket)
        {
            this.socket.close();
        }
    }
}

function connectWithRetry(client: WebSocketClient, retries = 0): Promise<WebSocketClient>
{
    console.log(`Attempting to connect to WebSocket server: ${client.url} (Attempt ${retries + 1}/${MAX_RETRIES})`);
    client.connect();

    return new Promise((resolve, reject) =>
    {
        const timeoutId = setTimeout(() =>
        {
            if (!client.socket || client.socket.readyState !== WebSocket.OPEN)
            {
                console.error(`Connection attempt ${retries + 1} failed or timed out`);
                if (retries < MAX_RETRIES - 1)
                {
                    console.log(`Scheduling next retry in ${RETRY_DELAY / 1000} seconds...`);
                    setTimeout(() => resolve(connectWithRetry(client, retries + 1)), RETRY_DELAY);
                } else
                {
                    reject(new Error(`Max retries (${MAX_RETRIES}) reached. Connection failed.`));
                }
            }
        }, CONNECTION_TIMEOUT);

        if (client.socket)
        {
            client.socket.once('open', () =>
            {
                clearTimeout(timeoutId);
                console.log(`Successfully connected to WebSocket server on attempt ${retries + 1}`);
                resolve(client);
            });

            client.socket.once('error', (error) =>
            {
                clearTimeout(timeoutId);
                console.error(`Connection error on attempt ${retries + 1}:`, error);
                if (retries < MAX_RETRIES - 1)
                {
                    console.log(`Scheduling next retry in ${RETRY_DELAY / 1000} seconds...`);
                    setTimeout(() => resolve(connectWithRetry(client, retries + 1)), RETRY_DELAY);
                } else
                {
                    reject(new Error(`Max retries (${MAX_RETRIES}) reached. Connection failed.`));
                }
            });
        }
    });
}

export function subscribeToTradeCreated(callback: (data: any) => void): Promise<WebSocketClient>
{
    const client = new WebSocketClient('tradeCreated', callback);
    return connectWithRetry(client);
}

export function subscribeToNewCoinCreated(callback: (data: any) => void): Promise<WebSocketClient>
{
    const client = new WebSocketClient('newCoinCreated', callback);
    return connectWithRetry(client);
}

// Example usage:
async function test()
{
    try
    {
        const tradeClient = await subscribeToTradeCreated((data) =>
        {
            console.log('Received trade data:', data);
        });

        const coinClient = await subscribeToNewCoinCreated((data) =>
        {
            console.log('Received new coin data:', data);
        });

        // Keep the connections alive for testing
        setTimeout(() =>
        {
            tradeClient.disconnect();
            coinClient.disconnect();
            console.log('Test completed');
        }, 60000); // Run for 1 minute
    } catch (error)
    {
        console.error('Test failed:', error);
    }
}

// Run the test if this file is executed directly
if (require.main === module)
{
    test();
}
