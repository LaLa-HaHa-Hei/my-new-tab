<template>
    <Teleport to="body">
        <img :src="imageUrl" class="fixed left-0 top-0 -z-10 w-full h-full object-cover" alt="background" />

        <button @click="editDialogVisible = true"
            class="fixed right-3 bottom-3 h-6 w-6 p-1 flex justify-center items-center cursor-pointer bg-white/20 hover:bg-white/30 text-white/50 rounded-full">
            <IconEdit />
        </button>
    </Teleport>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑背景图片" width="80%" class="flex flex-col"
        :before-close="handleEditDialogClose">
        <div><span>注意：该弹窗口关闭后才会保存更改到本地</span></div>
        <div class="flex items-center justify-center">
            <el-switch v-model="backgroundStore.backgroundConfig.useOnlineImage" size="large" active-text="使用在线图片"
                inactive-text="使用本地图片" style="--el-switch-off-color: #13ce66" />
        </div>

        <el-splitter>
            <!-- 本地图片配置 -->
            <el-splitter-panel class="p-3">
                <el-form label-width="auto" :disabled="backgroundStore.backgroundConfig.useOnlineImage" @submit.prevent>
                    <el-upload drag :on-change="handleChange" :auto-upload="false" :show-file-list="false"
                        accept="image/*" class="mb-5">
                        <div class="el-upload__text">
                            将文件拖到此处，或<em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-form-item label="本地图片地址">
                        <el-input clearable v-model="backgroundStore.backgroundConfig.localImageConfig.imageUrl"
                            placeholder="本地图片地址" />
                    </el-form-item>
                </el-form>
            </el-splitter-panel>
            <!-- 在线图片配置 -->
            <el-splitter-panel class="p-3">
                <el-form label-width="auto" :disabled="!backgroundStore.backgroundConfig.useOnlineImage"
                    @submit.prevent>
                    <el-form-item label="在线图片地址">
                        <el-input v-model="backgroundStore.backgroundConfig.onlineImageConfig.url"
                            placeholder="在线图片地址" />
                    </el-form-item>
                    <el-form-item label="获取频率" class="flex">
                        <el-select v-model="backgroundStore.backgroundConfig.onlineImageConfig.mode"
                            placeholder="Select">
                            <el-option v-for="item in modeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <!-- <div>若使用“每日获取”功能，请访问<a href="https://cors.sh/" target="_blank"
                            style="color: #409EFF;">cors.sh</a>获取一个免费的API Key填入下方</div>
                    <div>一般临时Key有效期3天，注意更新</div>
                    <el-form-item label="cors.sh Key">
                        <el-input v-model="backgroundStore.backgroundConfig.onlineImageConfig.corsShKey"
                            placeholder="cors.sh API Key" />
                    </el-form-item> -->
                </el-form>
            </el-splitter-panel>
        </el-splitter>
    </el-dialog>
</template>

<script setup lang="ts">
const BACKGROUND_CONFIG_KEY = 'backgroundConfig'
import { ref, computed } from 'vue'
import IconEdit from './icons/IconEdit.vue'
import { fileToBase64 } from '@/utils/base64Utils';
import { ElMessage } from 'element-plus'
import { useBackgroundStore } from '@/stores/background'

const editDialogVisible = ref(false)
const modeOptions = ref([{ value: 'dynamic', label: '每次获取' }])
const backgroundStore = useBackgroundStore()
const imageUrl = computed(
    () => backgroundStore.backgroundConfig.useOnlineImage ?
        (backgroundStore.backgroundConfig.onlineImageConfig.mode === 'dynamic' ? backgroundStore.backgroundConfig.onlineImageConfig.url : backgroundStore.backgroundConfig.onlineImageConfig.imageUrl) : backgroundStore.backgroundConfig.localImageConfig.imageUrl)

// onBeforeMount(async () => {
//     await updateBackgroundImg()
// })

// 无法解决跨域问题，暂时放弃
// const updateBackgroundImg = async () => {
//     if (backgroundStore.backgroundConfig.useOnlineImage && backgroundStore.backgroundConfig.onlineImageConfig.mode === 'daily') {
//         // 如果是每日获取，检查是否需要更新图片
//         const currentTime = Date.now();
//         const lastFetchTime = backgroundStore.backgroundConfig.onlineImageConfig.lastFetchTime;
//         const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数

//         if (currentTime - lastFetchTime > oneDay || backgroundStore.backgroundConfig.onlineImageConfig.imageUrl === '') {
//             // 更新图片地址
//             try {
//             }
//             catch (error) {
//                 ElMessage.error(`获取图片失败：${error}`);
//                 backgroundStore.backgroundConfig.onlineImageConfig.imageUrl = ''
//             }
//         }
//     }
// }

const handleEditDialogClose = async (done: () => void) => {
    backgroundStore.saveConfig()
    done()
    ElMessage.success('保存成功')
    // await updateBackgroundImg()
}

const handleChange = async (uploadFile: any) => {
    try {
        const base64 = await fileToBase64(uploadFile.raw);
        backgroundStore.backgroundConfig.localImageConfig.imageUrl = base64;
        ElMessage.success('设置图片成功')
    }
    catch (error) {
        ElMessage.error('设置图片失败')
    }
}
</script>