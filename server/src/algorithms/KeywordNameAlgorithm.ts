import { BaseAlgorithm, AlgorithmResult } from '@guttaai/core';
import { TokenMetadata } from '../types/tokenMetadata';

export class KeywordNameAlgorithm extends BaseAlgorithm
{
    name = 'Keyword Name Verification';
    description = 'Verifies if token name contains specific keywords';

    private keywords = [
        'ai',
        'artificial',
        'intelligence',
        'machine',
        'learning',
        'ml',
        'deep',
        'neural',
        'llm',
        'gpt',
        'chat',
        'bot',
        'smart',
        'brain',
        'intel',
        'mind',
        'robot'
    ];

    async execute(token: TokenMetadata): Promise<AlgorithmResult>
    {
        const checks = [
            {
                name: 'Name Keywords Check',
                status: 'pending',
                message: 'Checking for keywords in token name...',
                isCritical: true
            }
        ];

        if (!token.name)
        {
            checks[0].status = 'failed';
            checks[0].message = 'No token name provided';
            return {
                passed: false,
                criticalCheckFailed: true,
                checks
            };
        }

        const tokenName = token.name.toLowerCase();
        const foundKeywords = this.keywords.filter(keyword =>
            tokenName.includes(keyword.toLowerCase())
        );

        const hasKeywords = foundKeywords.length > 0;

        checks[0].status = hasKeywords ? 'success' : 'failed';
        checks[0].message = hasKeywords
            ? `Found keywords: ${foundKeywords.join(', ')}`
            : 'No relevant keywords found in token name';

        return {
            passed: hasKeywords,
            criticalCheckFailed: !hasKeywords,
            checks
        };
    }
} 