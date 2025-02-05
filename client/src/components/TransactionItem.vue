<script setup lang="ts">
interface Props
{
    signature: string;
    status: 'success' | 'pending' | 'error';
    timestamp: number;
    tokenSymbol: string;
}

defineProps<Props>();

const getStatusColor = (status: string) =>
{
    switch (status)
    {
        case 'success':
            return 'text-green-500';
        case 'pending':
            return 'text-orange-500';
        case 'error':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
};

const formatTimestamp = (timestamp: number) =>
{
    return new Date(timestamp).toLocaleTimeString();
};

const getSolscanUrl = (signature: string) => `https://solscan.io/tx/${signature}`;
</script>

<template>
    <div class="block p-3 mb-2 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="text-sm" :class="getStatusColor(status)">{{ status.toUpperCase() }}</span>
                <span class="text-gray-400">{{ tokenSymbol }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ formatTimestamp(timestamp) }}</span>
        </div>
        <div class="mt-1">
            <span v-if="status === 'error'" class="text-xs text-red-400 font-mono break-all block">{{ signature
                }}</span>
            <a v-else :href="getSolscanUrl(signature)" target="_blank"
                class="text-xs text-gray-500 font-mono hover:text-gray-400 truncate block">
                {{ signature }}
            </a>
        </div>
    </div>
</template>