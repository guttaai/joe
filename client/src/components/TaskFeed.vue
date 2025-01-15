<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import TaskItem from './TaskItem.vue';
import TitleLabel from './TitleLabel.vue';

const tokens = ref<TokenMetadata[]>([]);
const ws = ref<WebSocket | null>(null);
const connectionStatus = ref<string>('Disconnected');
const selectedTokenMint = ref<string | null>(null);

const emit = defineEmits<{
    'select-token': [token: TokenMetadata]
}>();

const handleTokenClick = (token: TokenMetadata) =>
{
    selectedTokenMint.value = token.mint;
    emit('select-token', token);
};

const connect = () =>
{
    ws.value = new WebSocket('ws://localhost:2050');

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
                <div class="w-2 h-2 rounded-full"
                    :class="connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-orange-500'"></div>
            </template>
        </TitleLabel>
        <div class="space-y-4">
            <TaskItem v-for="token in tokens" :key="token.mint" :token="token"
                :is-selected="selectedTokenMint === token.mint" @click="handleTokenClick(token)" />
        </div>
    </div>
</template>