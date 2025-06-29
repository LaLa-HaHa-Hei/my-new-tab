import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { DashboardConfig } from "@/types";
import storage from '@/utils/storage';

const DASHBOARD_CONTAINER_CONFIG_KEY = 'dashboardConfig'
export const useDashboardStore = defineStore('dashboard', () => {
    const getDefaultConfig = (): DashboardConfig => ({
        width: 80,
        items: [
            {
                id: '1751116407846',
                component: 'BookmarkItem',
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                props: {
                    title: '百度翻译',
                    url: 'https://fanyi.baidu.com/mtpe-individual/multimodal',
                    icon: './bookmark-icons/baidu-fanyi.ico',
                }
            },
            {
                id: '1751116407847',
                component: 'BookmarkItem',
                x: 1,
                y: 0,
                w: 0,
                h: 0,
                props: {
                    title: 'Gemini',
                    url: 'https://aistudio.google.com/prompts/new_chat',
                    icon: './bookmark-icons/google-ai-studio.png',
                }
            },
            {
                id: '1751116407848',
                component: 'BookmarkItem',
                x: 2,
                y: 0,
                w: 0,
                h: 0,
                props: {
                    title: 'ChatGPT',
                    url: 'https://chatgpt.com/',
                    icon: './bookmark-icons/chatgpt.webp',
                }
            },
        ]
    })
    const dashboardConfig: Ref<DashboardConfig> = ref<DashboardConfig>(storage.getItem(DASHBOARD_CONTAINER_CONFIG_KEY) || getDefaultConfig());

    // 保存配置
    function saveConfig() {
        storage.setItem(DASHBOARD_CONTAINER_CONFIG_KEY, dashboardConfig.value);
    }

    // 重置为默认配置
    function resetToDefault() {
        dashboardConfig.value = getDefaultConfig()
        saveConfig()
    }

    return {
        getDefaultConfig,
        dashboardConfig,
        saveConfig,
        resetToDefault,
    }
})