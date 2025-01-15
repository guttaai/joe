<script setup lang="ts">
import TaskFeed from './TaskFeed.vue';
</script>

<template>
    <div class="max-w-[1200px] mx-auto p-6">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        <div class="grid grid-cols-3 gap-1">
            <!-- Left Column -->
            <div class="bg-gray-950 rounded-lg p-4">
                <div>
                    <div class="text-white">Instructions</div>
                    <div>
                        <div>Main</div>
                    </div>
                </div>
                <div>
                    <div class="text-white">Operators</div>
                    <div>
                        <div>PumpFun NewToken</div>
                    </div>
                </div>
                <div>
                    <div class="text-white">AI-bots</div>
                    <div>
                        <div class="bg-green-500 w-5 h-5 rounded-sm"></div>
                    </div>
                </div>
                <div>
                    <div class="text-white">Algorithms</div>
                    <div>
                        <div>X or Telegram presence</div>
                    </div>
                </div>
                <div>
                    <div class="text-white">Functions</div>
                    <div>
                        <div>Buy</div>
                    </div>
                </div>
            </div>

            <!-- Middle Column -->
            <div class="bg-gray-950 rounded-lg p-4">
                <TaskFeed />
            </div>

            <!-- Right Column -->
            <div class="bg-gray-950 rounded-lg p-4">
                Right Column
            </div>
        </div>
    </div>
</template>