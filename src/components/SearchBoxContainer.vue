<template>
    <div class="w-full grid gap-2"
        :class="{ 'grid-cols-1': columnNum === 1, 'grid-cols-2': columnNum === 2, 'grid-cols-3': columnNum === 3, 'grid-cols-4': columnNum === 4, 'grid-cols-5': columnNum === 5, 'grid-cols-6': columnNum === 6, }">
        <template v-for="(item, index) in searchBoxList" :key="index">
            <SearchBox v-if="item.isUsed" :config="item" />
        </template>

        <!-- 编辑按钮 -->
        <div class="h-11 w-11 bg-white/60 rounded-full overflow-hidden">
            <button @click="editDialogVisible = true"
                class="w-full h-full p-2 flex justify-center items-center cursor-pointer text-gray-600">
                <IconEdit />
            </button>
        </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑搜索引擎" width="80%" :before-close="handleEditDialogClose">
        <div class="flex justify-between">
            <div>
                <span>列数：</span>
                <el-input-number size="small" v-model="columnNum" :min="1" :max="6" />
            </div>
            <div><span>注意：该弹窗口关闭后才会保存更改到本地</span></div>
            <div>
                <el-button type="primary" size="small" @click="addDialogVisible = true">添加</el-button>
            </div>
        </div>
        <el-table :data="searchBoxList" border class="w-full mt-3">
            <el-table-column label="使用" width="55">
                <template #default="scope"><el-switch size="small" v-model="scope.row.isUsed" /></template>
            </el-table-column>
            <el-table-column label="图标" width="55">
                <template #default="scope"><img :src="scope.row.icon" alt="" class="h-7" /></template>
            </el-table-column>
            <el-table-column label="图标URL">
                <template #default="scope"><el-input v-model="scope.row.icon" /></template>
            </el-table-column>
            <el-table-column label="提示词" width="120">
                <template #default="scope"><el-input v-model="scope.row.placeholder" /></template>
            </el-table-column>
            <el-table-column label="URL（%s为搜索词）">
                <template #default="scope"><el-input v-model="scope.row.searchUrl" /></template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleMoveUp(scope.$index)">↑</el-button>
                    <el-button size="small" @click="handleMoveDown(scope.$index)">↓</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 添加弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加搜索引擎" width="50%" :before-close="handleAddDialogClose">
        <el-form :model="newSearchBoxConfig" label-width="auto">
            <el-form-item label="图标">
                <img :src="newSearchBoxConfig.icon" alt="" class="h-7" />
            </el-form-item>
            <el-form-item label="图标URL">
                <el-input v-model="newSearchBoxConfig.icon" />
            </el-form-item>
            <el-form-item label="提示词">
                <el-input v-model="newSearchBoxConfig.placeholder" />
            </el-form-item>
            <el-form-item label="URL（%s为搜索词）">
                <el-input v-model="newSearchBoxConfig.searchUrl" />
            </el-form-item>
            <el-form-item>
                <div class="w-full flex justify-center">
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
const SEARCH_BOX_LIST_KEY = 'searchBoxList'
const SEARCH_BOX_COLUMN_NUM_KEY = 'searchBoxColumnNum'

import type { SearchBoxConfig } from '@/types'
import { ref } from 'vue'
import SearchBox from './SearchBox.vue'
import storage from '@/utils/storage'
import IconEdit from './icons/IconEdit.vue'
import { ElMessage } from 'element-plus'

const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const columnNum = ref(3)
const newSearchBoxConfig = ref<SearchBoxConfig>({
    isUsed: true,
    placeholder: '',
    icon: '',
    searchUrl: ''
})
const searchBoxList = ref<SearchBoxConfig[]>([
    {
        isUsed: true,
        placeholder: 'Bing',
        icon: "./search-engine-icons/bing.svg",
        searchUrl: 'https://www.bing.com/search?q=%s'
    },
    {
        isUsed: true,
        placeholder: 'DuckDuckGo',
        icon: "./search-engine-icons/duck-duck-go.svg",
        searchUrl: 'https://duckduckgo.com/?q=%s'
    },
    {
        isUsed: true,
        placeholder: 'Google',
        icon: "./search-engine-icons/google.svg",
        searchUrl: 'https://www.google.com/search?q=%s'
    },
    {
        isUsed: true,
        placeholder: 'Baidu',
        icon: "./search-engine-icons/baidu.svg",
        searchUrl: 'https://www.baidu.com/s?wd=%s'
    },
    {
        isUsed: true,
        placeholder: 'Bilibili',
        icon: "./search-engine-icons/bilibili.svg",
        searchUrl: 'https://search.bilibili.com/all?keyword=%s'
    },
    {
        isUsed: true,
        placeholder: 'Yandex',
        icon: "./search-engine-icons/yandex.svg",
        searchUrl: 'https://yandex.com/search/?text=%s'
    },
    {
        isUsed: false,
        placeholder: '矢量图',
        icon: "./search-engine-icons/iconfont.svg",
        searchUrl: 'https://www.iconfont.cn/search/index?searchType=icon&q=%s'
    },
])

columnNum.value = storage.getItem<number>(SEARCH_BOX_COLUMN_NUM_KEY) || columnNum.value
searchBoxList.value = storage.getItem<SearchBoxConfig[]>(SEARCH_BOX_LIST_KEY) || searchBoxList.value

const handleDelete = (index: number, row: SearchBoxConfig) => {
    searchBoxList.value.splice(index, 1)
}

const handleMoveUp = (index: number) => {
    if (index <= 0) return
    [searchBoxList.value[index - 1], searchBoxList.value[index]] = [searchBoxList.value[index], searchBoxList.value[index - 1]]
}

const handleMoveDown = (index: number) => {
    if (index >= searchBoxList.value.length - 1) return
    [searchBoxList.value[index], searchBoxList.value[index + 1]] = [searchBoxList.value[index + 1], searchBoxList.value[index]]
}

const handleEditDialogClose = (done: () => void) => {
    done()
    storage.setItem(SEARCH_BOX_LIST_KEY, searchBoxList.value)
    storage.setItem(SEARCH_BOX_COLUMN_NUM_KEY, columnNum.value)
    ElMessage.success('成功保存设置')
}

const handleAddDialogClose = (done: () => void) => {
    done()
    newSearchBoxConfig.value = {
        isUsed: true,
        placeholder: '',
        icon: '',
        searchUrl: ''
    }
}

const handleAdd = () => {
    searchBoxList.value.push({ ...newSearchBoxConfig.value })
    storage.setItem(SEARCH_BOX_LIST_KEY, searchBoxList.value)
    // 重置表单
    newSearchBoxConfig.value = {
        isUsed: true,
        placeholder: '',
        icon: '',
        searchUrl: ''
    }
    addDialogVisible.value = false
}
</script>