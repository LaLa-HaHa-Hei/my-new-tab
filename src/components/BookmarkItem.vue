<template>
    <div class="w-full h-full">
        <a class="w-full h-full rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10"
            :href="props.config.url">
            <div class="w-full overflow-hidden">
                <img class="w-full h-full object-contain" :src="props.config.icon" />
            </div>
            <div class="whitespace-nowrap text-center text-white/50">
                {{ props.config.title }}
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { BookmarkItemProps } from '@/types'

const props = defineProps<{
    config: BookmarkItemProps
}>()

</script>

<style scoped></style>
