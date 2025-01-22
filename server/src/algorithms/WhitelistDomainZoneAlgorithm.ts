import { BaseAlgorithm, AlgorithmResult } from '@guttaai/core';
import { TokenMetadata } from '../types/tokenMetadata';

export class WhitelistDomainZoneAlgorithm extends BaseAlgorithm
{
    name = 'Whitelist Domain Zone Verification';
    description = 'Verifies if token website has a whitelisted domain zone';

    private whitelistedDomainZones = [
        'io',
        'ai',
    ];

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Whitelisted Domain Zone Check',
                status: 'pending',
                message: 'Checking for whitelisted domain zones...',
                isCritical: true
            }
        ];

        if (!token.website)
        {
            checks[0].status = 'failed';
            checks[0].message = 'No website provided';
            return {
                passed: false,
                criticalCheckFailed: true,
                checks
            };
        }

        try
        {
            const url = new URL(token.website);
            const domainParts = url.hostname.split('.');
            const topLevelDomain = domainParts[domainParts.length - 1].toLowerCase();

            const isWhitelisted = this.whitelistedDomainZones.includes(topLevelDomain);

            checks[0].status = isWhitelisted ? 'success' : 'failed';
            checks[0].message = isWhitelisted
                ? 'Website domain zone is whitelisted'
                : `Domain zone ".${topLevelDomain}" is not whitelisted`;

            return {
                passed: isWhitelisted,
                criticalCheckFailed: !isWhitelisted,
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