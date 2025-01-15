<script setup lang="ts">
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';

interface Props
{
    details: {
        selectedToken: TokenMetadata | null;
        // Room for future data sources
        // databaseInfo?: any;
        // functionResults?: any;
        // websocketUpdates?: any;
    }
}

defineProps<Props>();
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <div class="text-xs text-gray-500 tracking-[0.2em]">DETAILS</div>
        </div>

        <div v-if="details.selectedToken" class="space-y-4">
            <div class="p-4 rounded-lg bg-gray-800/50">
                <pre
                    class="text-sm text-gray-300 overflow-x-auto">{{ JSON.stringify(details.selectedToken, null, 2) }}</pre>
            </div>

            <div v-if="details.selectedToken.algorithmResults" class="space-y-2">
                <div v-for="(result, index) in details.selectedToken.algorithmResults" :key="index"
                    class="p-4 rounded-lg bg-gray-800/50">
                    <div class="space-y-2">
                        <div v-for="check in result.checks" :key="check.name" class="flex items-center justify-between">
                            <span class="text-sm text-gray-300">{{ check.name }}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-sm" :class="{
                                    'text-orange-500': check.status === 'pending',
                                    'text-green-500': check.status === 'success',
                                    'text-red-500': check.status === 'failed'
                                }">
                                    {{ check.message }}
                                </span>
                                <div class="w-2 h-2 rounded-full" :class="{
                                    'bg-orange-500': check.status === 'pending',
                                    'bg-green-500': check.status === 'success',
                                    'bg-red-500': check.status === 'failed'
                                }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-gray-500 text-center p-4">
            Select a token to view details
        </div>
    </div>
</template>