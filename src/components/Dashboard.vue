<template>
    <div ref="gridRef" class="w-full grid-stack">
        <div v-for="item in dashboardStore.dashboardConfig.items" :key="item.id" class="grid-stack-item" :gs-x="item.x"
            :gs-y="item.y" :gs-w="item.w" :gs-h="item.h" :data-id="item.id">
            <component :is="componentMap[item.component]" :config="item.props" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import IconEdit from './icons/IconEdit.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { da } from 'element-plus/es/locales.mjs';
import BookmarkItem from './BookmarkItem.vue'
import type { DashboardConfig } from "@/types";
import MemoWidget from './widgets/MemoWidget.vue'

// 组件映射表
const componentMap: Record<string, any> = {
    "BookmarkItem": BookmarkItem,
    "MemoWidget": MemoWidget,
}

const gridRef = ref<HTMLDivElement | null>(null)
let grid: GridStack | null = null
const dashboardStore = useDashboardStore()

onMounted(() => {
    if (gridRef.value) {
        const cols = Math.max(1, Math.floor(gridRef.value.clientWidth / dashboardStore.dashboardConfig.width))
        grid = GridStack.init({
            column: cols,
            float: true, // 允许自由排列
        }, gridRef.value)

        grid.on('change', (event, items) => {
            items.forEach(item => {
                const id = item.el?.dataset?.id

                const target = dashboardStore.dashboardConfig.items.find(i => i.id === id)
                if (target) {
                    target.x = item.x ?? target.x
                    target.y = item.y ?? target.y
                    target.w = item.w ?? target.w
                    target.h = item.h ?? target.h

                    dashboardStore.saveConfig()
                }
            })
        })

        window.addEventListener('resize', handleResize)
    }
})

function handleResize() {
    if (gridRef.value && grid) {
        const cols = Math.max(1, Math.floor(gridRef.value.clientWidth / dashboardStore.dashboardConfig.width))
        grid.column(cols)
    }
}

onUnmounted(() => {
    if (grid) {
        grid.destroy(false)
        grid = null
    }

    window.removeEventListener('resize', handleResize)
})
</script>

<style>
@import 'gridstack/dist/gridstack.min.css';

.grid-stack-item {
    /* background-color: #18BC9C; */
    padding: 5px !important;
}
</style>