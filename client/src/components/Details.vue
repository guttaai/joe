<script setup lang="ts">
import type { TokenMetadata } from '../../../server/src/types/tokenMetadata';
import { CheckBadgeIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { LinkIcon } from '@heroicons/vue/24/outline'

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

const getPumpFunUrl = (mint: string) => `https://pump.fun/coin/${mint}`;
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <div class="text-xs text-gray-500 tracking-[0.2em]">DETAILS</div>
        </div>

        <div v-if="details.selectedToken" class="space-y-4">
            <!-- New Token Info Header -->
            <div class="p-4 rounded-lg bg-gray-800/50">
                <div class="space-y-3">
                    <!-- Symbol and Name -->
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-bold text-blue-100">{{ details.selectedToken.symbol }}</span>
                        <span class="text-gray-400">{{ details.selectedToken.name }}</span>
                    </div>

                    <!-- Links -->
                    <div class="flex flex-wrap gap-3">
                        <!-- Pump.fun Link -->
                        <a :href="getPumpFunUrl(details.selectedToken.mint)" target="_blank"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-900/50 hover:bg-purple-900/70 transition-colors">
                            <LinkIcon class="w-4 h-4" />
                            <span class="text-sm">pump.fun</span>
                        </a>

                        <!-- Website Link -->
                        <a v-if="details.selectedToken.website" :href="details.selectedToken.website" target="_blank"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-900/50 hover:bg-blue-900/70 transition-colors">
                            <LinkIcon class="w-4 h-4" />
                            <span class="text-sm">Website</span>
                        </a>

                        <!-- Twitter Link -->
                        <a v-if="details.selectedToken.twitter" :href="details.selectedToken.twitter" target="_blank"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-900/50 hover:bg-sky-900/70 transition-colors">
                            <LinkIcon class="w-4 h-4" />
                            <span class="text-sm">Twitter</span>
                        </a>

                        <!-- Telegram Link -->
                        <a v-if="details.selectedToken.telegram" :href="details.selectedToken.telegram" target="_blank"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-900/50 hover:bg-blue-900/70 transition-colors">
                            <LinkIcon class="w-4 h-4" />
                            <span class="text-sm">Telegram</span>
                        </a>
                    </div>
                </div>
            </div>

            <div v-if="details.selectedToken.algorithmResults" class="space-y-2">
                <div v-for="(result, index) in details.selectedToken.algorithmResults" :key="index"
                    class="p-4 rounded-lg bg-gray-800/50">
                    <div class="space-y-2">
                        <div v-for="check in result.checks" :key="check.name"
                            class="flex items-center gap-2 group relative">
                            <CheckBadgeIcon v-if="check.status === 'success'" class="w-5 h-5 text-green-500" />
                            <XCircleIcon v-else-if="check.status === 'failed'" class="w-5 h-5 text-red-500" />
                            <ArrowPathIcon v-else class="w-5 h-5 text-orange-500 animate-spin" />
                            <span class="text-sm" :class="{
                                'text-orange-500': check.status === 'pending',
                                'text-green-500': check.status === 'success',
                                'text-red-500': check.status === 'failed'
                            }">{{ check.message }}</span>
                            <!-- Tooltip -->
                            <div
                                class="absolute left-0 -top-8 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded">
                                {{ check.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- New Status Block -->
            <div class="p-4 rounded-lg" :class="details.selectedToken.send ? 'bg-green-900/50' : 'bg-amber-900/50'">
                <div class="flex items-center">
                    <span class="text-4xl w-16">
                        {{ details.selectedToken.send ? '🚀' : '💩' }}
                    </span>
                    <span class="flex-1 text-gray-100 tracking-[0.2em] text-sm text-center">
                        {{ details.selectedToken.send ? 'SEND' : 'FLUSH' }}
                    </span>
                    <span class="w-16"></span>
                </div>
            </div>

            <!-- JSON Display -->
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