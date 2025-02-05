/**
 * Single file to buy
 */

/**
 * IMPORTS
 */

import { Connection, Keypair, PublicKey, Transaction, ComputeBudgetProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { BN } from "bn.js";

import { struct, bool, u64, publicKey, Layout } from "@coral-xyz/borsh";

import
{
    Commitment,
    Finality,
    SendTransactionError,
    VersionedTransactionResponse,
} from "@solana/web3.js";

import { AnchorProvider } from "@coral-xyz/anchor";


/**
 * TYPES
 */

export type PriorityFee = {
    unitLimit: number;
    unitPrice: number;
};

export type TransactionResult = {
    signature?: string;
    error?: unknown;
    results?: VersionedTransactionResponse;
    success: boolean;
};

/**
 * FUNCTIONS
 */

type PumpFunIDL = {
    address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
    metadata: {
        name: "pump";
        version: "0.1.0";
        spec: "0.1.0";
    };
    version: "0.1.0";
    name: "pump";
    instructions: [{
        name: "buy";
        discriminator: [102, 6, 61, 18, 1, 218, 235, 234];
        docs: ["Buys tokens from a bonding curve."];
        accounts: [
            { name: "global"; pda: { seeds: [{ kind: "const"; value: [103, 108, 111, 98, 97, 108] }] } },
            { name: "feeRecipient"; writable: true; signer: false },
            { name: "mint"; writable: false; signer: false },
            { name: "bondingCurve"; writable: true; pda: { seeds: [{ kind: "const"; value: [98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101] }, { kind: "account"; path: "mint" }] } },
            { name: "associatedBondingCurve"; writable: true; signer: false },
            { name: "associatedUser"; writable: true; signer: false },
            { name: "user"; writable: true; signer: true },
            { name: "systemProgram"; address: "11111111111111111111111111111111" },
            { name: "tokenProgram"; address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { name: "rent"; address: "SysvarRent111111111111111111111111111111111" },
            { name: "eventAuthority"; address: "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1" },
            { name: "program"; address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" }
        ];
        args: [
            { name: "amount"; type: "u64" },
            { name: "maxSolCost"; type: "u64" }
        ];
    }];
};

export class GlobalAccount
{
    public discriminator: bigint;
    public initialized: boolean = false;
    public authority: PublicKey;
    public feeRecipient: PublicKey;
    public initialVirtualTokenReserves: bigint;
    public initialVirtualSolReserves: bigint;
    public initialRealTokenReserves: bigint;
    public tokenTotalSupply: bigint;
    public feeBasisPoints: bigint;

    constructor(
        discriminator: bigint,
        initialized: boolean,
        authority: PublicKey,
        feeRecipient: PublicKey,
        initialVirtualTokenReserves: bigint,
        initialVirtualSolReserves: bigint,
        initialRealTokenReserves: bigint,
        tokenTotalSupply: bigint,
        feeBasisPoints: bigint
    )
    {
        this.discriminator = discriminator;
        this.initialized = initialized;
        this.authority = authority;
        this.feeRecipient = feeRecipient;
        this.initialVirtualTokenReserves = initialVirtualTokenReserves;
        this.initialVirtualSolReserves = initialVirtualSolReserves;
        this.initialRealTokenReserves = initialRealTokenReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.feeBasisPoints = feeBasisPoints;
    }

    getInitialBuyPrice(amount: bigint): bigint
    {
        if (amount <= 0n)
        {
            return 0n;
        }

        let n = this.initialVirtualSolReserves * this.initialVirtualTokenReserves;
        let i = this.initialVirtualSolReserves + amount;
        let r = n / i + 1n;
        let s = this.initialVirtualTokenReserves - r;
        return s < this.initialRealTokenReserves
            ? s
            : this.initialRealTokenReserves;
    }

    public static fromBuffer(buffer: Buffer): GlobalAccount
    {
        const structure: Layout<GlobalAccount> = struct([
            u64("discriminator"),
            bool("initialized"),
            publicKey("authority"),
            publicKey("feeRecipient"),
            u64("initialVirtualTokenReserves"),
            u64("initialVirtualSolReserves"),
            u64("initialRealTokenReserves"),
            u64("tokenTotalSupply"),
            u64("feeBasisPoints"),
        ]);

        let value = structure.decode(buffer);
        return new GlobalAccount(
            BigInt(value.discriminator),
            value.initialized,
            value.authority,
            value.feeRecipient,
            BigInt(value.initialVirtualTokenReserves),
            BigInt(value.initialVirtualSolReserves),
            BigInt(value.initialRealTokenReserves),
            BigInt(value.tokenTotalSupply),
            BigInt(value.feeBasisPoints)
        );
    }
}


export class BondingCurveAccount
{
    public discriminator: bigint;
    public virtualTokenReserves: bigint;
    public virtualSolReserves: bigint;
    public realTokenReserves: bigint;
    public realSolReserves: bigint;
    public tokenTotalSupply: bigint;
    public complete: boolean;

    constructor(
        discriminator: bigint,
        virtualTokenReserves: bigint,
        virtualSolReserves: bigint,
        realTokenReserves: bigint,
        realSolReserves: bigint,
        tokenTotalSupply: bigint,
        complete: boolean
    )
    {
        this.discriminator = discriminator;
        this.virtualTokenReserves = virtualTokenReserves;
        this.virtualSolReserves = virtualSolReserves;
        this.realTokenReserves = realTokenReserves;
        this.realSolReserves = realSolReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.complete = complete;
    }

    getBuyPrice(amount: bigint): bigint
    {
        if (this.complete)
        {
            throw new Error("Curve is complete");
        }

        if (amount <= 0n)
        {
            return 0n;
        }

        // Calculate the product of virtual reserves
        let n = this.virtualSolReserves * this.virtualTokenReserves;

        // Calculate the new virtual sol reserves after the purchase
        let i = this.virtualSolReserves + amount;

        // Calculate the new virtual token reserves after the purchase
        let r = n / i + 1n;

        // Calculate the amount of tokens to be purchased
        let s = this.virtualTokenReserves - r;

        // Return the minimum of the calculated tokens and real token reserves
        return s < this.realTokenReserves ? s : this.realTokenReserves;
    }

    getSellPrice(amount: bigint, feeBasisPoints: bigint): bigint
    {
        if (this.complete)
        {
            throw new Error("Curve is complete");
        }

        if (amount <= 0n)
        {
            return 0n;
        }

        // Calculate the proportional amount of virtual sol reserves to be received
        let n =
            (amount * this.virtualSolReserves) / (this.virtualTokenReserves + amount);

        // Calculate the fee amount in the same units
        let a = (n * feeBasisPoints) / 10000n;

        // Return the net amount after deducting the fee
        return n - a;
    }

    getMarketCapSOL(): bigint
    {
        if (this.virtualTokenReserves === 0n)
        {
            return 0n;
        }

        return (
            (this.tokenTotalSupply * this.virtualSolReserves) /
            this.virtualTokenReserves
        );
    }

    getFinalMarketCapSOL(feeBasisPoints: bigint): bigint
    {
        let totalSellValue = this.getBuyOutPrice(
            this.realTokenReserves,
            feeBasisPoints
        );
        let totalVirtualValue = this.virtualSolReserves + totalSellValue;
        let totalVirtualTokens = this.virtualTokenReserves - this.realTokenReserves;

        if (totalVirtualTokens === 0n)
        {
            return 0n;
        }

        return (this.tokenTotalSupply * totalVirtualValue) / totalVirtualTokens;
    }

    getBuyOutPrice(amount: bigint, feeBasisPoints: bigint): bigint
    {
        let solTokens =
            amount < this.realSolReserves ? this.realSolReserves : amount;
        let totalSellValue =
            (solTokens * this.virtualSolReserves) /
            (this.virtualTokenReserves - solTokens) +
            1n;
        let fee = (totalSellValue * feeBasisPoints) / 10000n;
        return totalSellValue + fee;
    }

    public static fromBuffer(buffer: Buffer): BondingCurveAccount
    {
        const structure: Layout<BondingCurveAccount> = struct([
            u64("discriminator"),
            u64("virtualTokenReserves"),
            u64("virtualSolReserves"),
            u64("realTokenReserves"),
            u64("realSolReserves"),
            u64("tokenTotalSupply"),
            bool("complete"),
        ]);

        let value = structure.decode(buffer);
        return new BondingCurveAccount(
            BigInt(value.discriminator),
            BigInt(value.virtualTokenReserves),
            BigInt(value.virtualSolReserves),
            BigInt(value.realTokenReserves),
            BigInt(value.realSolReserves),
            BigInt(value.tokenTotalSupply),
            value.complete
        );
    }
}


class PumpDotFun
{
    static PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

    private connection: Connection;
    static DEFAULT_COMMITMENT: Commitment = "finalized";
    static DEFAULT_FINALITY: Finality = "finalized";

    static GLOBAL_ACCOUNT_SEED = "global";
    static MINT_AUTHORITY_SEED = "mint-authority";
    static BONDING_CURVE_SEED = "bonding-curve";
    static METADATA_SEED = "metadata";

    private program: Program<PumpFunIDL>;

    constructor(connection: Connection)
    {
        this.connection = connection;
        // Initialize provider and program
        const provider = new AnchorProvider(
            connection,
            {
                publicKey: PublicKey.default,
                signTransaction: async () => { throw new Error("Not implemented"); },
                signAllTransactions: async () => { throw new Error("Not implemented"); },
            },
            { commitment: PumpDotFun.DEFAULT_COMMITMENT }
        );

        this.program = new Program(
            {
                address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
                metadata: {
                    name: "pump",
                    version: "0.1.0",
                    spec: "0.1.0"
                },
                version: "0.1.0",
                name: "pump",
                instructions: [{
                    name: "buy",
                    discriminator: [102, 6, 61, 18, 1, 218, 235, 234],
                    docs: ["Buys tokens from a bonding curve."],
                    accounts: [
                        { name: "global", pda: { seeds: [{ kind: "const", value: [103, 108, 111, 98, 97, 108] }] } },
                        { name: "feeRecipient", writable: true, signer: false },
                        { name: "mint", writable: false, signer: false },
                        { name: "bondingCurve", writable: true, pda: { seeds: [{ kind: "const", value: [98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101] }, { kind: "account", path: "mint" }] } },
                        { name: "associatedBondingCurve", writable: true, signer: false },
                        { name: "associatedUser", writable: true, signer: false },
                        { name: "user", writable: true, signer: true },
                        { name: "systemProgram", address: "11111111111111111111111111111111" },
                        { name: "tokenProgram", address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
                        { name: "rent", address: "SysvarRent111111111111111111111111111111111" },
                        { name: "eventAuthority", address: "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1" },
                        { name: "program", address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" }
                    ],
                    args: [
                        { name: "amount", type: "u64" },
                        { name: "maxSolCost", type: "u64" }
                    ]
                }]
            } as PumpFunIDL,
            provider
        );
    }

    async buy(
        buyer: Keypair,
        mint: PublicKey,
        buyAmountSol: bigint,
        slippageBasisPoints: bigint = 500n,
        priorityFees?: PriorityFee,
        commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT,
        finality: Finality = PumpDotFun.DEFAULT_FINALITY
    ): Promise<TransactionResult>
    {
        let buyTx = await this.getBuyInstructionsBySolAmount(
            buyer.publicKey,
            mint,
            buyAmountSol,
            slippageBasisPoints,
            commitment
        );

        let buyResults = await this.sendTx(
            this.connection,
            buyTx,
            buyer.publicKey,
            [buyer],
            priorityFees,
            commitment,
            finality
        );
        return buyResults;
    }


    getBondingCurvePDA(mint: PublicKey)
    {
        return PublicKey.findProgramAddressSync(
            [Buffer.from(PumpDotFun.BONDING_CURVE_SEED), mint.toBuffer()],
            new PublicKey(PumpDotFun.PROGRAM_ID)
        )[0];
    }

    //buy
    async getBuyInstructions(
        buyer: PublicKey,
        mint: PublicKey,
        feeRecipient: PublicKey,
        amount: bigint,
        solAmount: bigint,
        commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT
    )
    {
        const associatedBondingCurve = await getAssociatedTokenAddress(
            mint,
            this.getBondingCurvePDA(mint),
            true
        );

        const associatedUser = await getAssociatedTokenAddress(mint, buyer, false);

        let transaction = new Transaction();

        try
        {
            await getAccount(this.connection, associatedUser, commitment);
        } catch (e)
        {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    buyer,
                    associatedUser,
                    buyer,
                    mint
                )
            );
        }

        transaction.add(
            await this.program.methods
                .buy(new BN(amount.toString()), new BN(solAmount.toString()))
                .accounts({
                    feeRecipient: feeRecipient,
                    mint: mint,
                    associatedBondingCurve: associatedBondingCurve,
                    associatedUser: associatedUser,
                    user: buyer,
                })
                .transaction()
        );

        return transaction;
    }


    async getBuyInstructionsBySolAmount(
        buyer: PublicKey,
        mint: PublicKey,
        buyAmountSol: bigint,
        slippageBasisPoints: bigint = 500n,
        commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT
    )
    {
        let bondingCurveAccount = await this.getBondingCurveAccount(
            mint,
            commitment
        );
        if (!bondingCurveAccount)
        {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }

        let buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);
        let buyAmountWithSlippage = this.calculateWithSlippageBuy(
            buyAmountSol,
            slippageBasisPoints
        );

        let globalAccount = await this.getGlobalAccount(commitment);

        return await this.getBuyInstructions(
            buyer,
            mint,
            globalAccount.feeRecipient,
            buyAmount,
            buyAmountWithSlippage
        );
    }


    async getBondingCurveAccount(
        mint: PublicKey,
        commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT
    )
    {
        const tokenAccount = await this.connection.getAccountInfo(
            this.getBondingCurvePDA(mint),
            commitment
        );
        if (!tokenAccount)
        {
            return null;
        }
        return BondingCurveAccount.fromBuffer(tokenAccount!.data);
    }

    async getGlobalAccount(commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT)
    {
        const [globalAccountPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from(PumpDotFun.GLOBAL_ACCOUNT_SEED)],
            new PublicKey(PumpDotFun.PROGRAM_ID)
        );

        const tokenAccount = await this.connection.getAccountInfo(
            globalAccountPDA,
            commitment
        );

        return GlobalAccount.fromBuffer(tokenAccount!.data);
    }


    private calculateWithSlippageBuy(amount: bigint, slippageBasisPoints: bigint): bigint
    {
        return amount + (amount * slippageBasisPoints) / 10000n;
    }

    // Add this new helper method to poll for transaction confirmation
    private async pollTxStatus(
        connection: Connection,
        sig: string,
        commitment: Commitment,
        maxTimeout: number = 20000, // e.g., 20 seconds
        interval: number = 1000     // check every 1 second
    ): Promise<boolean>
    {
        const startTime = Date.now();
        while (Date.now() - startTime < maxTimeout)
        {
            // Check the transaction status
            const statusResponse = await connection.getSignatureStatus(sig);
            const status = statusResponse && statusResponse.value;
            // When the transaction has been confirmed or finalized, status.confirmationStatus should be non-null.
            if (status && (status.confirmationStatus === 'finalized' || status.err === null))
            {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return false;
    }

    async sendTx(
        connection: Connection,
        tx: Transaction,
        payer: PublicKey,
        signers: Keypair[],
        priorityFees?: PriorityFee,
        commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT,
        finality: Finality = PumpDotFun.DEFAULT_FINALITY
    ): Promise<TransactionResult>
    {
        let newTx = new Transaction();

        if (priorityFees)
        {
            const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
                units: priorityFees.unitLimit,
            });

            const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: priorityFees.unitPrice,
            });
            newTx.add(modifyComputeUnits);
            newTx.add(addPriorityFee);
        }

        newTx.add(tx);

        let versionedTx = await this.buildVersionedTx(connection, payer, newTx, commitment);
        versionedTx.sign(signers);

        try
        {
            const sig = await connection.sendTransaction(versionedTx, {
                skipPreflight: false,
            });
            console.log("sig:", `https://solscan.io/tx/${sig}`);

            // Wait for the transaction status to be confirmed reliably.
            const confirmed = await this.pollTxStatus(connection, sig, commitment);
            if (!confirmed)
            {
                console.warn("Transaction not confirmed within the timeout period.");
                return {
                    success: false,
                    error: "Transaction not confirmed within the timeout period.",
                };
            }

            // At this point, the transaction should be confirmed.
            const txResult = await connection.getTransaction(sig, {
                maxSupportedTransactionVersion: 0,
                commitment: finality,
            });

            // If we still don't get transaction details, return the signature only (or treat as error if desired).
            if (!txResult)
            {
                console.warn("No transaction details fetched after confirmation, but transaction might have succeeded. Returning success with signature only.");
                return {
                    success: true,
                    signature: sig,
                };
            }
            return {
                success: true,
                signature: sig,
                results: txResult,
            };
        } catch (e)
        {
            if (e instanceof SendTransactionError)
            {
                let ste = e as SendTransactionError;
                console.log("SendTransactionError: " + await ste.getLogs(connection));
            } else
            {
                console.error(e);
            }
            return {
                error: e,
                success: false,
            };
        }
    }

    private async buildVersionedTx(
        connection: Connection,
        payer: PublicKey,
        tx: Transaction,
        commitment: Commitment
    ): Promise<VersionedTransaction>
    {
        const { blockhash } = await connection.getLatestBlockhash(commitment);
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer;

        const messageV0 = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions: tx.instructions,
        }).compileToV0Message();

        return new VersionedTransaction(messageV0);
    }

    // async getTxDetails(
    //     connection: Connection,
    //     sig: string,
    //     commitment: Commitment = PumpDotFun.DEFAULT_COMMITMENT,
    //     finality: Finality = PumpDotFun.DEFAULT_FINALITY
    // ): Promise<VersionedTransactionResponse | null>
    // {
    //     const latestBlockHash = await connection.getLatestBlockhash();
    //     await connection.confirmTransaction(
    //         {
    //             blockhash: latestBlockHash.blockhash,
    //             lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //             signature: sig,
    //         },
    //         commitment
    //     );

    //     return connection.getTransaction(sig, {
    //         maxSupportedTransactionVersion: 0,
    //         commitment: finality,
    //     });
    // };
}

export default PumpDotFun;

