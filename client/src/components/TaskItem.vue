<script setup lang="ts">
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';

defineProps<{
    token: TokenMetadata
}>();

const getBackgroundClass = (token: TokenMetadata) =>
{
    if (!token.algorithmResults?.length) return 'bg-gray-800/50';

    const hasFailedCriticalChecks = token.algorithmResults.some(result => result.criticalCheckFailed);
    if (hasFailedCriticalChecks)
    {
        return 'bg-red-900/50 opacity-50';
    }

    const allChecksPassed = token.algorithmResults.every(result => result.passed);
    return allChecksPassed ? 'bg-green-900/50' : 'bg-gray-800/50';
};
</script>

<template>
    <div :class="[
        'p-4 mb-4 rounded-lg backdrop-blur cursor-pointer transition-colors',
        'hover:bg-opacity-70',
        getBackgroundClass(token)
    ]" @click="$emit('click')">
        <div class="flex items-center justify-start gap-2 text-lg">
            <span class="font-semibold text-blue-100">{{ token.symbol }}</span>
            <span class="text-gray-700">•</span>
            <span class="text-gray-500">{{ token.name }}</span>
        </div>
    </div>
</template>