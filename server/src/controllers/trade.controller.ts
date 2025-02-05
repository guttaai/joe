import { Controller, Post, Body } from '@nestjs/common';
import { execute } from '../services/trader/legacy/execute';
import { Connection } from '@solana/web3.js';

interface TradeRequest
{
    amount: number;
    mintAddress: string;
}

@Controller('trade')
export class TradeController
{
    private readonly DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

    @Post()
    async executeTrade(@Body() tradeRequest: TradeRequest)
    {
        const { amount, mintAddress } = tradeRequest;

        console.log('Trade request received:', {
            amount,
            mintAddress,
        });

        try
        {
            if (!process.env.PRIVATE_KEY)
            {
                throw new Error('PRIVATE_KEY is not set in the environment variables.');
            }


            const result = await execute(
                amount,
                mintAddress,
                process.env.PRIVATE_KEY || '',
                'base64',
                this.DEFAULT_RPC
            );

            if (result.success)
            {
                return {
                    status: 'success',
                    data: {
                        amount,
                        mintAddress,
                        signature: result.signature,
                    }
                };
            } else
            {
                console.error('Trade execution not successful yet:', result);
                return {
                    status: 'pending',
                    data: {
                        amount,
                        mintAddress,
                        signature: result.signature,
                    }
                };
            }

        } catch (error)
        {
            console.error('Trade execution error:', error);
            return {
                status: 'error',
                error: (error as Error).message || 'Unknown error occurred'
            };
        }
    }
}