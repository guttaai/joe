<script setup lang="ts">
defineProps<{
    text: string;
    rightContent?: boolean;
}>();
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <div class="text-xs text-gray-500 tracking-[0.2em]">{{ text }}</div>
        <div v-if="rightContent" class="flex items-center">
            <slot name="right"></slot>
        </div>
    </div>
</template>