import { BaseAlgorithm, AlgorithmResult } from '@guttaai/core';
import { TokenMetadata } from '../types/tokenMetadata';

export class TwitterLinkAlgorithm extends BaseAlgorithm
{
    name = 'Twitter Link Verification';
    description = 'Verifies if token has a valid Twitter/X link domain';

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Twitter Domain Check',
                status: 'pending',
                message: 'Checking Twitter link domain...',
                isCritical: true
            }
        ];

        if (!token.twitter)
        {
            checks[0].status = 'failed';
            checks[0].message = 'No Twitter link provided';
            return {
                passed: false,
                criticalCheckFailed: true,
                checks
            };
        }

        try
        {
            const url = new URL(token.twitter);
            const isValidDomain = url.hostname === 'twitter.com' || url.hostname === 'x.com';
            const hasNoStatus = !url.pathname.includes('/status/');
            const isValid = isValidDomain && hasNoStatus;

            checks[0].status = isValid ? 'success' : 'failed';
            checks[0].message = isValid
                ? 'Valid Twitter domain'
                : isValidDomain
                    ? 'Twitter URL cannot contain /status/'
                    : 'Invalid Twitter domain';

            return {
                passed: isValid,
                criticalCheckFailed: !isValid,
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