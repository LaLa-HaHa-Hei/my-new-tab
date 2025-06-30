import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { SearchBoxConfig, SearchBoxContainerConfig } from "@/types";
import storage from '@/utils/storage';

const SEARCH_BOX_CONTAINER_CONFIG_KEY = 'searchBoxContainerConfig'
export const useSearchBoxStore = defineStore('searchBox', () => {
    const getDefaultConfig = (): SearchBoxContainerConfig => ({
        columns: 4,
        items: [
            {
                id: '1751116407846',
                isUsed: true,
                placeholder: 'Baidu',
                icon: "./search-engine-icons/baidu.svg",
                searchUrl: 'https://www.baidu.com/s?wd=%s'
            },
            {
                id: '1751116407843',
                isUsed: true,
                placeholder: 'Bing',
                icon: "./search-engine-icons/bing.svg",
                searchUrl: 'https://www.bing.com/search?q=%s'
            },
            {
                id: '1751116407845',
                isUsed: true,
                placeholder: 'Google',
                icon: "./search-engine-icons/google.svg",
                searchUrl: 'https://www.google.com/search?q=%s'
            },
            {
                id: '1751116407844',
                isUsed: true,
                placeholder: 'DuckDuckGo',
                icon: "./search-engine-icons/duck-duck-go.svg",
                searchUrl: 'https://duckduckgo.com/?q=%s'
            },
            {
                id: '1751116407847',
                isUsed: true,
                placeholder: 'Bilibili',
                icon: "./search-engine-icons/bilibili.svg",
                searchUrl: 'https://search.bilibili.com/all?keyword=%s'
            },
            {
                id: '1751116407848',
                isUsed: true,
                placeholder: 'Yandex',
                icon: "./search-engine-icons/yandex.svg",
                searchUrl: 'https://yandex.com/search/?text=%s'
            },
            {
                id: '1751116407849',
                isUsed: true,
                placeholder: 'GitHub',
                icon: "./search-engine-icons/github.png",
                searchUrl: 'https://github.com/search?q=%s&type=repositories'
            },
            {
                id: '1751116407850',
                isUsed: false,
                placeholder: '矢量图',
                icon: "./search-engine-icons/iconfont.svg",
                searchUrl: 'https://www.iconfont.cn/search/index?searchType=icon&q=%s'
            },
        ]
    })
    const containerConfig: Ref<SearchBoxContainerConfig> = ref<SearchBoxContainerConfig>(storage.getItem(SEARCH_BOX_CONTAINER_CONFIG_KEY) || getDefaultConfig());

    // 仅获取已启用的搜索框
    const usedSearchBoxes = computed(() =>
        containerConfig.value.items.filter(box => box.isUsed)
    )

    // 保存配置
    function saveConfig() {
        storage.setItem(SEARCH_BOX_CONTAINER_CONFIG_KEY, containerConfig.value);
    }

    // 添加新搜索框
    function addSearchBox(box: Partial<SearchBoxConfig>) {
        const newBox: SearchBoxConfig = {
            id: Date.now().toString(),
            isUsed: true,
            placeholder: '',
            icon: '',
            searchUrl: '',
            ...box
        }
        containerConfig.value.items.push(newBox)
        saveConfig()
    }

    // 删除搜索框
    function deleteSearchBox(index: number) {
        containerConfig.value.items.splice(index, 1)
        saveConfig()
    }

    // 移动搜索框位置
    function moveSearchBox(fromIndex: number, toIndex: number) {
        const boxes = containerConfig.value.items
        const originalLength = boxes.length
        if (
            fromIndex < 0 || fromIndex >= originalLength ||
            toIndex < 0 || toIndex >= originalLength ||
            fromIndex === toIndex
        ) {
            return
        }

        const [removed] = boxes.splice(fromIndex, 1)

        // 删除之后数组长度减少，向后移动时需要修正索引
        const adjustedIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
        boxes.splice(adjustedIndex, 0, removed)

        saveConfig()
    }

    // 重置为默认配置
    function resetToDefault() {
        containerConfig.value = getDefaultConfig()
        saveConfig()
    }

    return {
        getDefaultConfig,
        containerConfig,
        usedSearchBoxes,
        saveConfig,
        addSearchBox,
        deleteSearchBox,
        moveSearchBox,
        resetToDefault,
    }
})