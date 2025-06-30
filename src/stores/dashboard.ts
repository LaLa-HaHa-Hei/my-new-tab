import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { DashboardConfig } from "@/types";
import storage from '@/utils/storage';

const DASHBOARD_CONTAINER_CONFIG_KEY = 'dashboardConfig'
export const useDashboardStore = defineStore('dashboard', () => {
    const getDefaultConfig = (): DashboardConfig => ({
        width: 85,
        items: [
            {
                id: '1751116407845',
                component: 'MemoWidget',
                x: 0, y: 0, w: 3, h: 2,
                props: undefined
            },
            {
                id: '1751116407846',
                component: 'BookmarkItem',
                x: 4, y: 0, w: 0, h: 0,
                props: {
                    title: '百度翻译',
                    url: 'https://fanyi.baidu.com/mtpe-individual/multimodal',
                    icon: './bookmark-icons/baidu-fanyi.ico',
                }
            },
            {
                id: '1751116407847',
                component: 'BookmarkItem',
                x: 5, y: 0, w: 0, h: 0,
                props: {
                    title: 'Gemini',
                    url: 'https://aistudio.google.com/prompts/new_chat',
                    icon: './bookmark-icons/google-ai-studio.png',
                }
            },
            {
                id: '1751116407848',
                component: 'BookmarkItem',
                x: 6, y: 0, w: 0, h: 0,
                props: {
                    title: 'ChatGPT',
                    url: 'https://chatgpt.com/',
                    icon: './bookmark-icons/chatgpt.webp',
                }
            },
            {
                id: '1751116407849',
                component: 'BookmarkItem',
                x: 7, y: 0, w: 0, h: 0,
                props: {
                    title: '豆包',
                    url: 'https://www.doubao.com/chat/',
                    icon: './bookmark-icons/doubao.png',
                }
            },
            {
                id: '1751116407850',
                component: 'BookmarkItem',
                x: 8, y: 0, w: 0, h: 0,
                props: {
                    title: 'Claude',
                    url: 'https://claude.ai/new',
                    icon: './bookmark-icons/claude.svg',
                }
            },
            {
                id: '1751116407851',
                component: 'BookmarkItem',
                x: 9, y: 0, w: 0, h: 0,
                props: {
                    title: 'Grok',
                    url: 'https://grok.com/',
                    icon: './bookmark-icons/grok.svg',
                }
            },
            {
                id: '1751116407851',
                component: 'BookmarkItem',
                x: 10, y: 0, w: 0, h: 0,
                props: {
                    title: 'DeepSeek',
                    url: 'https://chat.deepseek.com/',
                    icon: './bookmark-icons/deepseek.svg',
                }
            },
            {
                id: '1751116407851',
                component: 'BookmarkItem',
                x: 11, y: 0, w: 0, h: 0,
                props: {
                    title: 'Qwen',
                    url: 'https://chat.qwen.ai/',
                    icon: './bookmark-icons/qwen.png',
                }
            },
            {
                id: '1751116407852',
                component: 'BookmarkItem',
                x: 12, y: 0, w: 0, h: 0,
                props: {
                    title: '通义千问',
                    url: 'https://www.tongyi.com/qianwen/',
                    icon: './bookmark-icons/qianwen.png',
                }
            },
        ]
    })
    const config: Ref<DashboardConfig> = ref<DashboardConfig>(storage.getItem(DASHBOARD_CONTAINER_CONFIG_KEY) || getDefaultConfig());

    // 保存配置
    function saveConfig() {
        storage.setItem(DASHBOARD_CONTAINER_CONFIG_KEY, config.value);
    }

    // 重置为默认配置
    function resetToDefault() {
        config.value = getDefaultConfig()
        saveConfig()
    }

    return {
        getDefaultConfig,
        dashboardConfig: config,
        saveConfig,
        resetToDefault,
    }
})