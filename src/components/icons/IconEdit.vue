<template>
    <svg v-bind="svgAttrs" t="1751026942267" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="1508">
        <path fill="currentColor"
            d="M469.333333 128a42.666667 42.666667 0 0 1 0 85.333333H213.333333v597.333334h597.333334v-256l0.298666-4.992A42.666667 42.666667 0 0 1 896 554.666667v256a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z m414.72 12.501333a42.666667 42.666667 0 0 1 0 60.330667L491.861333 593.066667a42.666667 42.666667 0 0 1-60.330666-60.330667l392.192-392.192a42.666667 42.666667 0 0 1 60.330666 0z"
            p-id="1509"></path>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    size?: string,
}>()

const svgAttrs = computed(() => {
    const attrs: Record<string, string> = {}
    if (props.size) {
        attrs.width = props.size
        attrs.height = props.size
    }
    return attrs
})
</script>