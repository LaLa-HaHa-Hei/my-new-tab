import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { BackgroundConfig } from "@/types";
import storage from '@/utils/storage';

const BACKGROUND_CONFIG_KEY = 'backgroundConfig'
export const useBackgroundStore = defineStore('background', () => {
    const getDefaultConfig = (): BackgroundConfig => ({
        useOnlineImage: false,
        onlineImageConfig: {
            url: 'https://bing.img.run/rand_1366x768.php',
            imageUrl: '',
            mode: 'dynamic',
            lastFetchTime: 0,
        },
        localImageConfig: {
            imageUrl: './background-images/dye.png'
        }
    })
    const backgroundConfig: Ref<BackgroundConfig> = ref<BackgroundConfig>(storage.getItem(BACKGROUND_CONFIG_KEY) || getDefaultConfig());

    // 保存配置
    function saveConfig() {
        storage.setItem(BACKGROUND_CONFIG_KEY, backgroundConfig.value);
    }

    // 重置为默认配置
    function resetToDefault() {
        backgroundConfig.value = getDefaultConfig()
        saveConfig()
    }

    return {
        backgroundConfig,
        getDefaultConfig,
        saveConfig,
        resetToDefault,
    }
})