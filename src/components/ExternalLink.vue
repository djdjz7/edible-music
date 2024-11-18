<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid';
defineProps<{
    href: string | undefined,
    content: string,
}>();
</script>

<template>
    <a underline-offset-4 text-black font-semibold inline-flex items-center target="_blank" :href="href">
        <span>{{ content }}</span>
        <ArrowTopRightOnSquareIcon class="h-4" />
    </a>
</template>