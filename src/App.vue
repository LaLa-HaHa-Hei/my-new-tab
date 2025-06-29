<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Background from "@/components/Background.vue";
import Clock from "@/components/Clock.vue";
import SearchBoxContainer from "@/components/SearchBoxContainer.vue";
import Dashboard from './components/Dashboard.vue';

const isDark = useDark()
</script>

<template>
    <Background />
    <div class="h-full flex flex-col mx-auto w-[90%]">
        <div class="w-full mt-15">
            <Clock />
        </div>
        <div class="w-full mt-6">
            <SearchBoxContainer />
        </div>
        <div class="w-full flex-1 mt-6">
            <Dashboard />
        </div>
    </div>
</template>

<style scoped></style>
