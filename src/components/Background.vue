<template>
    <Teleport to="body">
        <img :src="imgUrl" class="fixed left-0 top-0 -z-10 w-full h-full object-cover" alt="background" />

        <button @click="editDialogVisible = true"
            class="fixed right-3 bottom-3 h-6 w-6 p-1 flex justify-center items-center cursor-pointer bg-white/20 text-white/50 hover:bg-white/30 rounded-full">
            <IconEdit />
        </button>
    </Teleport>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑背景图片" width="80%" class="flex flex-col"
        :before-close="handleEditDialogClose">
        <div><span>注意：该弹窗口关闭后才会保存更改到本地</span></div>
        <div class="flex items-center justify-center">
            <el-switch v-model="backgroundConfig.useOnlineImg" size="large" active-text="使用在线图片" inactive-text="使用本地图片"
                style="--el-switch-off-color: #13ce66" />
        </div>

        <el-splitter>
            <!-- 本地图片配置 -->
            <el-splitter-panel class="p-3">
                <el-form label-width="auto" :disabled="backgroundConfig.useOnlineImg" @submit.prevent>
                    <el-upload drag :on-change="handleChange" :auto-upload="false" :show-file-list="false"
                        accept="image/*" class="mb-5">
                        <div class="el-upload__text">
                            将文件拖到此处，或<em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-form-item label="本地图片地址">
                        <el-input clearable v-model="backgroundConfig.LocalImgConfig.imgUrl" placeholder="本地图片地址" />
                    </el-form-item>
                </el-form>
            </el-splitter-panel>
            <!-- 在线图片配置 -->
            <el-splitter-panel class="p-3">
                <el-form label-width="auto" :disabled="!backgroundConfig.useOnlineImg" @submit.prevent>
                    <el-form-item label="在线图片地址">
                        <el-input v-model="backgroundConfig.OnlineImgConfig.url" placeholder="在线图片地址" />
                    </el-form-item>
                    <el-form-item label="获取频率" class="flex">
                        <el-select v-model="backgroundConfig.OnlineImgConfig.mode" placeholder="Select">
                            <el-option v-for="item in modeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-splitter-panel>
        </el-splitter>
    </el-dialog>
</template>

<script setup lang="ts">
const BACKGROUND_CONFIG_KEY = 'backgroundConfig'
import { ref, onBeforeMount } from 'vue'
import IconEdit from './icons/IconEdit.vue'
import storage from '@/utils/storage'
import { urlToBase64, fileToBase64 } from '@/utils/base64Utils';
import { ElMessage } from 'element-plus'


const editDialogVisible = ref(false)
const modeOptions = ref([{ value: 'daily', label: '每日获取（需可跨域）' }, { value: 'dynamic', label: '每次获取' }])
const backgroundConfig: any = ref({
    useOnlineImg: false,
    OnlineImgConfig: {
        url: 'https://bing.img.run/rand_1366x768.php',
        imgUrl: 'no image',
        mode: 'dynamic',
        lastFetchTime: 0
    },
    LocalImgConfig: {
        imgUrl: './backgrounds/dye.png'
    }
})
const imgUrl = ref('')

onBeforeMount(async () => {
    await updateBackgroundImg()
})

const updateBackgroundImg = async () => {
    backgroundConfig.value = storage.getItem(BACKGROUND_CONFIG_KEY) || backgroundConfig.value
    if (backgroundConfig.value.useOnlineImg) {
        if (backgroundConfig.value.OnlineImgConfig.mode === 'dynamic') {
            imgUrl.value = backgroundConfig.value.OnlineImgConfig.url
        }
        else {
            // 如果是每日获取，检查是否需要更新图片
            const currentTime = new Date().getTime();
            const lastFetchTime = backgroundConfig.value.OnlineImgConfig.lastFetchTime;
            const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数

            if (currentTime - lastFetchTime > oneDay || backgroundConfig.value.OnlineImgConfig.imgUrl === 'no image') {
                // 更新图片地址
                try {
                    backgroundConfig.value.OnlineImgConfig.imgUrl = await urlToBase64(backgroundConfig.value.OnlineImgConfig.url);
                    imgUrl.value = backgroundConfig.value.OnlineImgConfig.imgUrl;
                    backgroundConfig.value.OnlineImgConfig.lastFetchTime = currentTime;
                    storage.setItem(BACKGROUND_CONFIG_KEY, backgroundConfig.value);
                }
                catch (error) {
                    ElMessage.error(`获取图片失败：${error}`);
                    backgroundConfig.value.OnlineImgConfig.imgUrl = 'no image'
                }
            }
            else {
                imgUrl.value = backgroundConfig.value.OnlineImgConfig.imgUrl;
            }
        }
    }
    else {
        imgUrl.value = backgroundConfig.value.LocalImgConfig.imgUrl
    }
}

const handleEditDialogClose = (done: () => void) => {
    done()
    storage.setItem(BACKGROUND_CONFIG_KEY, backgroundConfig.value)
    ElMessage.success('成功保存设置')
}

const handleChange = async (uploadFile: any) => {
    try {
        const base64 = await fileToBase64(uploadFile.raw);
        backgroundConfig.value.LocalImgConfig.imgUrl = base64;
        ElMessage.success('成功设置图片')
    }
    catch (error) {
        ElMessage.error('设置图片失败')
    }
}
</script>