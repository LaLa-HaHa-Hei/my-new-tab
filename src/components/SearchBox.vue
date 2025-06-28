<template>
    <div ref="containerRef" class="w-full h-11 flex flex-col relative font-medium">
        <div class="flex items-center w-full h-full p-2 pl-3 rounded-lg border border-white/50"
            :class="{ 'shadow-lg': isFocused, 'bg-white': isFocused, 'bg-white/60': !isFocused }">
            <!-- 左侧输入框 -->
            <input v-model="query" type="text" :placeholder="config.placeholder" @focus="isFocused = true"
                @blur="isFocused = false" @keydown.enter="onSearch"
                class="flex-1 border-none outline-none focus:ring-0 min-w-0" />

            <!-- 右侧图标 -->
            <button @click="onSearch" class="h-full cursor-pointer ml-2">
                <img :src="config.icon" alt="" class="h-full" />
            </button>
        </div>

        <!-- 联想词展示区 -->
        <div v-show="suggestions.length > 0 && showSuggestions"
            class="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <ul>
                <li v-for="(suggestion, index) in suggestions" :key="index" @click="onSelect(suggestion)"
                    class="p-2 cursor-pointer hover:bg-gray-200 truncate whitespace-nowrap">
                    {{ suggestion }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SearchBoxConfig } from '@/types'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import debounce from 'lodash.debounce';
import axios from 'axios';

const props = defineProps<{
    config: SearchBoxConfig
}>()

const query = ref<string>('');
const suggestions = ref<string[]>([]);
const showSuggestions = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const isFocused = ref(false);

// 监听输入内容的变化
watch(query, () => {
    fetchSuggestions();
});

const onSelect = (suggestion: string) => {
    query.value = suggestion;
    suggestions.value = [];
    onSearch()
};

const onSearch = () => {
    const url = props.config.searchUrl.replace('%s', query.value);
    window.location.href = url
};

let controller: AbortController | null = null; // 用于取消请求的控制器
const fetchSuggestions = debounce(async () => {
    // 如果上一次请求还没完成，取消它
    if (controller) {
        controller.abort();
    }

    if (!query.value.trim()) {
        suggestions.value = [];
        showSuggestions.value = false;
        return;
    }

    controller = new AbortController();
    const signal = controller.signal;

    try {
        const targetUrl = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${navigator.language}&q=${encodeURIComponent(query.value)}`;
        const encodedUrl = encodeURIComponent(targetUrl);
        const response = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`, { signal })
        const contents = JSON.parse(response.data.contents)
        suggestions.value = contents[1];
        showSuggestions.value = true;
    } catch (error: any) {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
            // 请求被取消，不做处理
        }
        else {
            console.error('Error fetching suggestions:', error);
            suggestions.value = [];
            showSuggestions.value = false;
        }
    } finally {
    }
}, 250); // 250ms 防抖延迟

const handleClickOutside = (event: MouseEvent) => {
    if (
        containerRef.value &&
        !containerRef.value.contains(event.target as Node)
    ) {
        showSuggestions.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style></style>
