import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import PumpDotFun from './buy';

// Constants
const LAMPORTS_PER_SOL = 1_000_000_000;
const SLIPPAGE_BASIS_POINTS = 500n;
const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

interface BuyResult
{
    success: boolean;
    signature?: string;
    error?: any;
    bondingCurve?: any;
}

export async function execute(
    solAmount: number,
    mintAddress: string,
    privateKey: string,
    privateKeyFormat: 'base64' | 'hex' | 'array' = 'base64',
    rpcEndpoint: string = DEFAULT_RPC
): Promise<BuyResult>
{
    try
    {
        // Initialize connection
        const connection = new Connection(rpcEndpoint, {
            commitment: 'confirmed',
            confirmTransactionInitialTimeout: 30000,
            wsEndpoint: rpcEndpoint.replace('https://', 'wss://'),
        });

        // Initialize PumpDotFun
        const pump = new PumpDotFun(connection);

        // Process private key based on format
        let keyArray: Uint8Array;
        switch (privateKeyFormat)
        {
            case 'base64':
                keyArray = Uint8Array.from(Buffer.from(privateKey, 'base64'));
                break;
            case 'hex':
                keyArray = Uint8Array.from(Buffer.from(privateKey, 'hex'));
                break;
            case 'array':
                keyArray = Uint8Array.from(JSON.parse(privateKey));
                break;
        }
        const buyerKeypair = Keypair.fromSecretKey(keyArray);

        // Convert mint address string to PublicKey
        const mintPubkey = new PublicKey(mintAddress);

        // Convert SOL amount to lamports
        const lamports = BigInt(solAmount * LAMPORTS_PER_SOL);

        // Priority fees configuration
        const priorityFees = {
            unitLimit: 250000,
            unitPrice: 250000,
        };

        const buyResults = await pump.buy(
            buyerKeypair,
            mintPubkey,
            lamports,
            SLIPPAGE_BASIS_POINTS,
            priorityFees
        );

        if (buyResults.success)
        {
            const bondingCurveAfter = await pump.getBondingCurveAccount(mintPubkey);
            return {
                success: true,
                signature: buyResults.signature,
                bondingCurve: bondingCurveAfter
            };
        }

        return {
            success: false,
            error: buyResults.error
        };

    } catch (error)
    {
        return {
            success: false,
            error: error
        };
    }
} 