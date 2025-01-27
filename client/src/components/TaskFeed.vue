<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import { FunnelIcon } from '@heroicons/vue/24/outline';
import TaskItem from './TaskItem.vue';
import TitleLabel from './TitleLabel.vue';

const tokens = ref<TokenMetadata[]>([]);
const ws = ref<WebSocket | null>(null);
const connectionStatus = ref<string>('Disconnected');
const selectedTokenMint = ref<string | null>(null);
const showOnlyPassed = ref(false);

const filteredTokens = computed(() =>
{
    if (!showOnlyPassed.value) return tokens.value;

    return tokens.value.filter(token =>
        token.algorithmResults?.every(result => result.passed) ?? false
    );
});

const emit = defineEmits<{
    'select-token': [token: TokenMetadata]
}>();

const handleTokenClick = (token: TokenMetadata) =>
{
    selectedTokenMint.value = token.mint;
    emit('select-token', token);
};

const toggleFilter = () =>
{
    showOnlyPassed.value = !showOnlyPassed.value;
};

const connect = () =>
{
    const wsUrl = `ws://${window.location.hostname}:2050`;
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () =>
    {
        connectionStatus.value = 'Connected';
    };

    ws.value.onmessage = (event) =>
    {
        const message = JSON.parse(event.data);
        if (message.type === 'newToken')
        {
            tokens.value.unshift(message.data);
        }
    };

    ws.value.onclose = () =>
    {
        connectionStatus.value = 'Disconnected';
        setTimeout(connect, 1000);
    };

    ws.value.onerror = (error) =>
    {
        console.error('WebSocket error:', error);
    };
};

onMounted(() =>
{
    connect();
});

onUnmounted(() =>
{
    ws.value?.close();
});
</script>

<template>
    <div>
        <TitleLabel text="PUMP.FUN FEED" :right-content="true">
            <template #right>
                <div class="flex items-center gap-2">
                    <button @click="toggleFilter" class="p-1 rounded-md hover:bg-gray-800 transition-colors"
                        :class="{ 'bg-gray-800': showOnlyPassed }">
                        <FunnelIcon class="w-4 h-4" :class="{ 'text-green-500': showOnlyPassed }" />
                    </button>
                    <div class="w-2 h-2 rounded-full"
                        :class="connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-orange-500'"></div>
                </div>
            </template>
        </TitleLabel>
        <div class="space-y-4">
            <TaskItem v-for="token in filteredTokens" :key="token.mint" :token="token"
                :is-selected="selectedTokenMint === token.mint" @click="handleTokenClick(token)" />
        </div>
    </div>
</template>