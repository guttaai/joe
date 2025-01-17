import { BaseAlgorithm, AlgorithmResult } from '@guttaai/core';
import { TokenMetadata } from '../types/tokenMetadata';

export class BlacklistDomainAlgorithm extends BaseAlgorithm
{
    name = 'Blacklist Domain Verification';
    description = 'Verifies if token website contains blacklisted domains';

    private blacklistedDomains = [
        'x.com',
        'twitter.com',
        'tiktok.com',
        't.me',
        'telegram.org',
        'youtube.com',
        'github.com',
        'google.com',
        'pump.fun',
        'facebook.com',
        'instagram.com',
        'discord.com',
        'discord.gg',
        'wikipedia.org',
    ];

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Blacklisted Domain Check',
                status: 'pending',
                message: 'Checking for blacklisted domains...',
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
            const isBlacklisted = this.blacklistedDomains.some(domain =>
                url.hostname === domain || url.hostname.endsWith(`.${domain}`));

            checks[0].status = isBlacklisted ? 'failed' : 'success';
            checks[0].message = isBlacklisted
                ? 'Website contains blacklisted domain'
                : 'Website domain is valid';

            return {
                passed: !isBlacklisted,
                criticalCheckFailed: isBlacklisted,
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