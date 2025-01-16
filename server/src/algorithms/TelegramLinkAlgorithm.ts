import { BaseAlgorithm, AlgorithmResult } from '@guttaai/core';
import { TokenMetadata } from '../types/tokenMetadata';

export class TelegramLinkAlgorithm extends BaseAlgorithm
{
    name = 'Telegram Link Verification';
    description = 'Verifies if token has a valid Telegram link domain';

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Telegram Domain Check',
                status: 'pending',
                message: 'Checking Telegram link domain...',
                isCritical: true
            }
        ];

        if (!token.telegram)
        {
            checks[0].status = 'failed';
            checks[0].message = 'No Telegram link provided';
            return {
                passed: false,
                criticalCheckFailed: true,
                checks
            };
        }

        try
        {
            const url = new URL(token.telegram);
            const isValidDomain = url.hostname === 'telegram.org' || url.hostname === 't.me';

            checks[0].status = isValidDomain ? 'success' : 'failed';
            checks[0].message = isValidDomain
                ? 'Valid Telegram domain'
                : 'Invalid Telegram domain';

            return {
                passed: isValidDomain,
                criticalCheckFailed: !isValidDomain,
                checks
            };
        } catch (error)
        {
            checks[0].status = 'failed';
            checks[0].message = 'Invalid URL format';

            return {
                passed: false,
                criticalCheckFailed: true,
                checks
            };
        }
    }
} 