<script setup lang="ts">
import { ref, computed } from 'vue';
import TitleLabel from './TitleLabel.vue';
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';

interface Props
{
    selectedToken: TokenMetadata | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    transaction: [{ signature: string; status: 'success' | 'pending' | 'error'; timestamp: number; tokenSymbol: string; }]
}>();

const isTokenSelected = computed(() =>
{
    console.log('Token selection status:', props.selectedToken !== null);
    return props.selectedToken !== null;
});

const amount = ref<number>(0);
const isLoading = ref(false);

const setAmount = (value: number) =>
{
    amount.value = value;
};

const handleInput = (e: Event) =>
{
    const target = e.target as HTMLInputElement;
    amount.value = Number(target.value);
};

const handleBuy = async () =>
{
    if (!props.selectedToken || isLoading.value) return;

    isLoading.value = true;

    try
    {
        const response = await fetch(`http://${window.location.hostname}:3000/trade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount.value,
                mintAddress: props.selectedToken.mint,
            }),
        });

        const data = await response.json();
        console.log('Trade response:', data);

        if (data.status === 'error')
        {
            emit('transaction', {
                signature: data.error || 'Unknown error',
                status: 'error',
                timestamp: Date.now(),
                tokenSymbol: props.selectedToken.symbol,
            });
            return;
        }

        if (!data.data?.signature || data.data.signature === 'unknown')
        {
            emit('transaction', {
                signature: 'Bonding curve not found yet',
                status: 'error',
                timestamp: Date.now(),
                tokenSymbol: props.selectedToken.symbol,
            });
            return;
        }

        emit('transaction', {
            signature: data.data.signature,
            status: data.status,
            timestamp: Date.now(),
            tokenSymbol: props.selectedToken.symbol,
        });
    } catch (error)
    {
        console.error('Error executing trade:', error);
        emit('transaction', {
            signature: (error as Error).message || 'Unknown error occurred',
            status: 'error',
            timestamp: Date.now(),
            tokenSymbol: props.selectedToken.symbol,
        });
    } finally
    {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="bg-gray-950 rounded-lg p-4">
        <TitleLabel text="TRADE" />
        <div class="space-y-4">
            <!-- Amount Input -->
            <div>
                <input type="number" :value="amount" @input="handleInput" :disabled="!isTokenSelected || isLoading"
                    step="0.01" placeholder="Amount"
                    class="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500" />
            </div>

            <!-- Quick Amount Buttons -->
            <div class="flex gap-2">
                <button v-for="quickAmount in [0.01, 0.05, 0.1]" :key="quickAmount" @click="setAmount(quickAmount)"
                    :disabled="!isTokenSelected || isLoading"
                    class="flex-1 px-2 py-1 text-sm bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ quickAmount }}
                </button>
            </div>

            <!-- Buy Button -->
            <button @click="handleBuy" :disabled="!isTokenSelected || isLoading"
                class="w-full px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                {{ isLoading ? 'Processing...' : 'Buy' }}
            </button>
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
</style>