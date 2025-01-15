import { BaseAlgorithm, AlgorithmResult } from '../core/algorithms/BaseAlgorithm';
import { TokenMetadata } from '../types/tokenMetadata';

export class SocialLinksAlgorithm extends BaseAlgorithm
{
    name = 'Social Links Verification';
    description = 'Verifies if token has website and at least one social link';

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Website Check',
                status: 'pending',
                message: 'Checking website presence...',
                isCritical: true
            },
            {
                name: 'Social Links Check',
                status: 'pending',
                message: 'Checking social media presence...',
                isCritical: true
            }
        ];

        // Website check
        checks[0].status = token.website ? 'success' : 'failed';
        checks[0].message = token.website
            ? 'Website found'
            : 'No website provided';

        // Social links check
        const hasSocialLinks = token.twitter || token.telegram;
        checks[1].status = hasSocialLinks ? 'success' : 'failed';
        checks[1].message = hasSocialLinks
            ? 'Social links found'
            : 'No social links found';

        // Check if any critical checks failed
        const criticalCheckFailed = checks
            .filter(check => check.isCritical)
            .some(check => check.status === 'failed');

        return {
            passed: Boolean(token.website) && Boolean(hasSocialLinks),
            criticalCheckFailed,
            checks
        };
    }
} 