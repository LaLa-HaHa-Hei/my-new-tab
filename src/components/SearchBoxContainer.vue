<template>
    <div class="w-full grid gap-2"
        :class="{ 'grid-cols-1': searchBoxStore.columns === 1, 'grid-cols-2': searchBoxStore.columns === 2, 'grid-cols-3': searchBoxStore.columns === 3, 'grid-cols-4': searchBoxStore.columns === 4, 'grid-cols-5': searchBoxStore.columns === 5, 'grid-cols-6': searchBoxStore.columns === 6, }">
        <template v-for="item in searchBoxStore.usedSearchBoxes" :key="item.id">
            <SearchBox v-if="item.isUsed" :config="item" />
        </template>

        <!-- 编辑按钮 -->
        <div class="h-11 w-11 bg-white/30 hover:bg-white/40 rounded-full overflow-hidden">
            <button @click="editDialogVisible = true"
                class="w-full h-full p-2 flex justify-center items-center cursor-pointer text-white/50">
                <IconEdit />
            </button>
        </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑搜索引擎" width="80%" :before-close="handleEditDialogClose">
        <div class="flex justify-between">
            <div>
                <span>列数：</span>
                <el-input-number size="small" v-model="searchBoxStore.searchBoxContainerConfig.columns" :min="1"
                    :max="6" />
            </div>
            <div><span>注意：该弹窗口关闭后才会保存更改到本地</span></div>
            <div>
                <el-button type="primary" size="small" @click="addDialogVisible = true">添加</el-button>
            </div>
        </div>
        <el-table :data="searchBoxStore.searchBoxes" border class="w-full mt-3">
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
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 添加弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加搜索引擎" width="50%" :before-close="handleAddDialogClose">
        <el-form :model="newSearchBoxItem" label-width="auto">
            <el-form-item label="图标">
                <img :src="newSearchBoxItem.icon" alt="" class="h-7" />
            </el-form-item>
            <el-form-item label="图标URL">
                <el-input v-model="newSearchBoxItem.icon" />
            </el-form-item>
            <el-form-item label="提示词">
                <el-input v-model="newSearchBoxItem.placeholder" />
            </el-form-item>
            <el-form-item label="URL（%s为搜索词）">
                <el-input v-model="newSearchBoxItem.searchUrl" />
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
import type { SearchBoxConfig, SearchBoxContainerConfig } from '@/types'
import { ref } from 'vue'
import SearchBox from './SearchBox.vue'
import IconEdit from './icons/IconEdit.vue'
import { ElMessage } from 'element-plus'
import { useSearchBoxStore } from '@/stores/searchBox'
import { ElMessageBox } from 'element-plus'

const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const searchBoxStore = useSearchBoxStore()
const newSearchBoxItem = ref<Partial<SearchBoxConfig>>({
    isUsed: true,
    placeholder: '',
    icon: '',
    searchUrl: ''
})

const handleDelete = (index: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        searchBoxStore.deleteSearchBox(index)
    }).catch(() => {
    })
}

const handleMoveUp = (index: number) => {
    if (index <= 0) return
    searchBoxStore.moveSearchBox(index, index - 1)
}

const handleMoveDown = (index: number) => {
    if (index >= searchBoxStore.searchBoxes.length - 1) return
    searchBoxStore.moveSearchBox(index, index + 1)
}

const handleEditDialogClose = (done: () => void) => {
    searchBoxStore.saveConfig()
    done()
    ElMessage.success('保存成功')
}

const handleAddDialogClose = (done: () => void) => {
    done()
    newSearchBoxItem.value = {
        isUsed: true,
        placeholder: '',
        icon: '',
        searchUrl: ''
    }
}

const handleAdd = () => {
    searchBoxStore.addSearchBox(newSearchBoxItem.value)
    searchBoxStore.saveConfig()
    // 重置表单
    newSearchBoxItem.value = {
        isUsed: true,
        placeholder: '',
        icon: '',
        searchUrl: ''
    }
    addDialogVisible.value = false
    ElMessage.success('保存成功')
}
</script>