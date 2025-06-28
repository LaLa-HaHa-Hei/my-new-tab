<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Background from "@/components/Background.vue";
import Clock from "@/components/Clock.vue";
import SearchBoxContainer from "@/components/SearchBoxContainer.vue";

const isDark = useDark()
</script>

<template>
    <Background />
    <div class="w-full h-full">
        <div class="w-full mt-15">
            <Clock />
        </div>
        <div class="w-full mt-6 px-20">
            <SearchBoxContainer />
        </div>
    </div>
</template>

<style scoped></style>
