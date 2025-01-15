<script setup lang="ts">
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';

defineProps<{
    token: TokenMetadata
}>();
</script>

<template>
    <div class="p-4 border rounded-lg shadow-sm mb-4 bg-white">
        <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ JSON.stringify(token, null, 2) }}</pre>
    </div>
</template>