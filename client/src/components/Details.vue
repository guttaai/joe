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
        </div>

        <div v-else class="text-gray-500 text-center p-4">
            Select a token to view details
        </div>
    </div>
</template>