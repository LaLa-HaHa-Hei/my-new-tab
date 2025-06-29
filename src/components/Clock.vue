<template>
    <div class="w-full text-white/50 text-center">
        <div class="text-6xl font-medium">{{ formattedDateTime.hour }}:{{ formattedDateTime.minute }}</div>
        <div class="text-lg font-medium mt-2">{{ formattedDateTime.month }}月{{ formattedDateTime.day }}日</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const refreshInterval = 1000 * 10 // 10秒刷新一次

const currentDate = ref(new Date())
// 计算格式化的时间和日期
const formattedDateTime = computed(() => ({
    month: currentDate.value.getMonth() + 1,
    day: currentDate.value.getDate(),
    hour: String(currentDate.value.getHours()).padStart(2, '0'),
    minute: String(currentDate.value.getMinutes()).padStart(2, '0')
}))

let timeInterval: number
// 更新当前时间
onMounted(() => {
    timeInterval = setInterval(() => {
        currentDate.value = new Date()
    }, refreshInterval)
})

onUnmounted(() => {
    clearInterval(timeInterval)
})
</script>