<script setup lang="ts">
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';

defineProps<{
    token: TokenMetadata
}>();
</script>

<template>
    <div class="p-4 mb-4 rounded-lg bg-gray-800/50 backdrop-blur">
        <div class="flex items-center justify-start gap-2 text-lg">
            <span class="font-semibold text-blue-100">{{ token.symbol }}</span>
            <span class="text-gray-700">•</span>
            <span class="text-gray-500">{{ token.name }}</span>
        </div>
    </div>
</template>