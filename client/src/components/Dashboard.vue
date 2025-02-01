<script setup lang="ts">
import { ref } from 'vue';
import TaskFeed from './TaskFeed.vue';
import Details from './Details.vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import TitleLabel from './TitleLabel.vue';
import TradeBlock from './TradeBlock.vue';

const selectedToken = ref<TokenMetadata | null>(null);

const handleTokenSelect = (token: TokenMetadata) =>
{
    console.log('Token selected:', token);
    selectedToken.value = token;
};

const handleBuy = () =>
{
    console.log('Buy clicked, token:', selectedToken.value);
};
</script>

<template>
    <div class="max-w-[1580px] mx-auto p-6">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        <div class="grid grid-cols-4 gap-1 h-[calc(100vh-120px)]">
            <!-- Left Column -->
            <div class="bg-gray-950 rounded-lg p-3 overflow-y-auto">
                <TitleLabel text="JOE PROJECT" />
                <div>
                    <TitleLabel text="INSTRUCTIONS" />
                    <div class="flex flex-wrap gap-1">
                        <div
                            class="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            AI-related</div>
                    </div>
                </div>
                <div>
                    <TitleLabel text="OPERATORS" class="mt-4" />
                    <div class="flex flex-wrap gap-2">
                        <div
                            class="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            PumpFun NewToken</div>
                    </div>
                </div>
                <div>
                    <TitleLabel text="AGENTS" class="mt-4" />
                    <div class="flex flex-wrap gap-2">
                        <div class="bg-green-500 w-5 h-5 rounded-sm"></div>
                    </div>
                </div>
                <div>
                    <TitleLabel text="ALGORITHMS" class="mt-4" />
                    <div class="flex flex-wrap gap-2">
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Uniqueness</div>
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Rugcheck</div>
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Website presence</div>
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            X or Telegram presence</div>
                    </div>
                </div>
                <div>
                    <TitleLabel text="FUNCTIONS" class="mt-4" />
                    <div class="flex flex-wrap gap-2">
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Browser</div>
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Crawler</div>
                        <div
                            class="px-2 py-1 text-sm  bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                            Buy</div>
                    </div>
                </div>
            </div>

            <!-- Middle Column -->
            <div class="bg-gray-950 rounded-lg p-4 overflow-y-auto hide-scrollbar">
                <TaskFeed @select-token="handleTokenSelect" />
            </div>

            <!-- Right Column -->
            <div class="bg-gray-950 rounded-lg p-4 overflow-y-auto">
                <Details :details="{ selectedToken }" />
            </div>

            <!-- Trade and Positions Column -->
            <div class="flex flex-col gap-1">
                <!-- Trade Block -->
                <TradeBlock :selectedToken="selectedToken" @buy="handleBuy" />

                <!-- Transactions Block -->
                <div class="bg-gray-950 rounded-lg p-4 flex-1 overflow-y-auto">
                    <TitleLabel text="TRANSACTIONS" />
                    <div class="mt-4 flex items-center justify-center h-[calc(100%-2rem)] text-gray-500">
                        No transactions
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>