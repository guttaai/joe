<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import TaskItem from './TaskItem.vue';

const tokens = ref<TokenMetadata[]>([]);
const ws = ref<WebSocket | null>(null);
const connectionStatus = ref<string>('Disconnected');

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
        <div class="mb-4 text-sm" :class="connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'">
            Status: {{ connectionStatus }}
        </div>
        <div class="space-y-4">
            <TaskItem v-for="token in tokens" :key="token.mint" :token="token" />
        </div>
    </div>
</template>