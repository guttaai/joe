<script setup lang="ts">
import { ref } from 'vue';
import TaskFeed from './TaskFeed.vue';
import Details from './Details.vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import TitleLabel from './TitleLabel.vue';

const selectedToken = ref<TokenMetadata | null>(null);
const amount = ref<number>(0);

const handleTokenSelect = (token: TokenMetadata) =>
{
    selectedToken.value = token;
};

const setAmount = (value: number) =>
{
    amount.value = value;
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
                <div class="bg-gray-950 rounded-lg p-4">
                    <TitleLabel text="TRADE" />
                    <div class="space-y-4">
                        <!-- Amount Input -->
                        <div>
                            <input type="number" v-model="amount" step="0.01" placeholder="Amount"
                                class="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500" />
                        </div>

                        <!-- Quick Amount Buttons -->
                        <div class="flex gap-2">
                            <button v-for="quickAmount in [0.01, 0.05, 0.1]" :key="quickAmount"
                                @click="setAmount(quickAmount)"
                                class="flex-1 px-2 py-1 text-sm bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors">
                                {{ quickAmount }}
                            </button>
                        </div>

                        <!-- Buy Button -->
                        <button class="w-full px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md transition-colors">
                            Buy
                        </button>
                    </div>
                </div>

                <!-- Positions Block -->
                <div class="bg-gray-950 rounded-lg p-4 flex-1 overflow-y-auto">
                    <TitleLabel text="POSITIONS" />
                    <div class="mt-4 flex items-center justify-center h-[calc(100%-2rem)] text-gray-500">
                        No active positions
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Completely hide the input spinner arrows in WebKit browsers */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Hide spinner arrows in Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}

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