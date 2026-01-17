<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { editData, statusOrder, modalIsOpen, isNew, editStatus } = storeToRefs(store)
const { closeModal, submit, deleteGame } = store

import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { zhCN } from "date-fns/locale"

import { ref, watch } from 'vue'

// 預設 platform & category
const platformList = ref(['Switch', 'PlayStation', 'Xbox', 'Steam', 'Epic Games', 'iOS', 'Android'])
const categoryList = ref([
  '動作冒險','平台跳躍','射擊','角色扮演','策略','模擬','運動','音樂節奏','恐怖','解謎','生存',
  '競速','格鬥','養成','冒險敘事','探索'
])

const otherPlatform = ref('')
const otherCategory = ref('')

// 去重
function unique(arr: string[]) {
  return Array.from(new Set(arr))
}

// 手動新增 platform
function addPlatform() {
  const val = otherPlatform.value.trim()
  if (!val) return
  editData.value.platform = unique([...editData.value.platform, val])
  platformList.value = unique([...platformList.value, val])
  otherPlatform.value = ''
}

// 手動新增 category
function addCategory() {
  const val = otherCategory.value.trim()
  if (!val) return
  editData.value.category = unique([...editData.value.category, val])
  categoryList.value = unique([...categoryList.value, val])
  otherCategory.value = ''
}

// 自動同步 editData 
watch(editData, () => {
  platformList.value = unique([...platformList.value, ...editData.value.platform])
  categoryList.value = unique([...categoryList.value, ...editData.value.category])
}, { deep: true })
</script>

<template>
    <transition name="fadeup">
        <div v-if="modalIsOpen"
            class="bg-black/20 w-full h-[100dvh] fixed top-0 left-0 flex justify-center items-center z-20">
            <div class="relative bg-gray-200 max-w-[900px] w-[93%] h-[90dvh] rounded-sm overflow-y-scroll">
                <div class="w-full h-2 bg-[#EDAA5F] sticky top-0"></div>

                <div class="w-full max-w-[700px] mx-auto text-[#19556D] px-6 sm:px-8 py-6 sm:py-12 ">
                    <div class="flex justify-end">
                        <button v-if="!isNew" @click="deleteGame"
                            class="btn rounded-sm bg-[#FF4450] hover:opacity-90">刪除</button>
                    </div>

                    <div class="flex flex-col gap-8 flex-wrap">
                        <div class="w-full flex flex-col md:flex-row gap-8">
                            <div class="flex-1">
                                <div class="mb-2">遊戲名稱<span class="text-[#EDAA5F]">*</span></div>
                                <input type="text" class="text-input text-gray-600" v-model="editData.name">
                                <div v-if="editStatus.nameError" class="text-sm text-[#FF4450] mt-1">{{
                                    editStatus.nameError }}</div>
                            </div>
                            <div class="flex-1">
                                <div class="mb-2">圖片連結</div>
                                <input type="text" class="text-input text-gray-600" v-model="editData.img">
                            </div>
                        </div>

                        <div class="w-full">
                            <div class="mb-2">遊戲進度<span class="text-[#EDAA5F]">*</span></div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <label v-for="item in statusOrder"
                                    class="text-gray-600 text-sm flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" v-model="editData.status" :value="item.status"
                                        class="radio" />
                                    <span>{{ item.statusCN }}</span>
                                </label>
                            </div>
                            <div v-if="editStatus.statusError" class="text-sm text-[#FF4450] mt-1">{{
                                editStatus.statusError }}</div>
                        </div>

                        <div class="w-full">
                            <div class="mb-2">使用平台</div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <label v-for="item in platformList"
                                    class="text-gray-600 text-sm flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="platform" v-model="editData.platform" :value="item"
                                        class="radio" />
                                    <span>{{ item }}</span>
                                </label>
                                <label class="relative text-sm">
                                    <input type="text" v-model="otherPlatform" @keydown.enter.prevent="addPlatform"
                                        class="add-input">
                                    <button @click="addPlatform"
                                        class="bg-white px-2 py-1 cursor-pointer hover:opacity-70">+</button>
                                </label>
                            </div>
                        </div>

                        <div class="w-full">
                            <div class="mb-2">遊戲類型</div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <label v-for="item in categoryList"
                                    class="text-gray-600 text-sm flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="category" v-model="editData.category" :value="item"
                                        class="radio" />
                                    <span>{{ item }}</span>
                                </label>

                                <label class="relative text-sm">
                                    <input type="text" v-model="otherCategory" @keydown.enter.prevent="addCategory"
                                        class="add-input">
                                    <button @click="addCategory"
                                        class="bg-white px-2 py-1 cursor-pointer hover:opacity-70">+</button>
                                </label>
                            </div>
                        </div>

                        <div class="w-full">
                            <div class="mb-2">遊戲筆記</div>
                            <textarea name="note" id="note" v-model="editData.note" class="w-full bg-white p-1 text-sm outline-none h-20 text-gray-600"></textarea>
                        </div>

                        <div class="w-full flex flex-col md:flex-row gap-8">
                            <div class="flex-1">
                                <div class="mb-2">開始時間</div>
                                <VueDatePicker v-model="editData.startAt" :time-config="{ enableTimePicker: false }"
                                    :locale="zhCN"
                                    :ui="{ input: '!text-sm !rounded-none !border-none !text-gray-600' }" />
                            </div>
                            
                            <div class="flex-1">
                                <div class="mb-2">完成時間</div>
                                <VueDatePicker v-model="editData.completedAt" :time-config="{ enableTimePicker: false }"
                                    :locale="zhCN"
                                    :ui="{ input: '!text-sm !rounded-none !border-none !text-gray-600' }" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full bg-[#EDAA5F] px-6 sm:px-8 py-3 sm:py-4 flex gap-5 justify-end sticky bottom-0">
                    <button @click="closeModal" class="btn hover:opacity-80">取消</button>
                    <button :disabled="editStatus.loading" @click="submit"
                        :class="editStatus.loading ? 'opacity-90' : 'hover:opacity-90'"
                        class="btn bg-[#19556D] ">確認</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.add-input {
    background-color: rgb(255, 255, 255);
    padding: 0.25rem 0.5rem;
    outline: none;
    width: 5rem;
}
</style>