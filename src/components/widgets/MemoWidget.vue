<template>
    <div class="w-full h-full flex flex-col">
        <div class="w-full flex justify-center items-center text-white/50 bg-white/30  rounded-t-lg p-1 cursor-move">
            <IconDrag size="1rem" />
        </div>
        <textarea ref="textareaRef" v-model="memo" placeholder="备忘录"
            class="overflow-auto w-full h-full bg-white/50 text-black p-2 rounded-b-lg outline-0 resize-none"></textarea>
    </div>
</template>

<script setup lang="ts">
const MEMO_KEY = 'memo';
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import storage from '@/utils/storage';
import IconDrag from '@/components/icons/IconDrag.vue';
import debounce from 'lodash.debounce';

const props = defineProps<{
    config: undefined
}>()

const textareaRef = ref(null);
const memo = ref(storage.getItem(MEMO_KEY) || '');
const saveMemo = debounce(() => {
    storage.setItem(MEMO_KEY, memo.value);
}, 1000)

watch(() => memo.value, () => {
    saveMemo();
})

// 组件卸载或页面关闭时保存备忘录
onBeforeUnmount(() => {
    saveMemo.flush()
})
window.addEventListener('beforeunload', () => {
    saveMemo.flush()
});
</script>

<style scoped></style>
