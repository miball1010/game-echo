<script setup lang="ts">
import type { Game } from '@/types/game'
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore.ts'

const store = useGameStore()
const { editModal } = store

const props = defineProps<{
    data: Game
}>()

const statusMap: Record<string, string> = {
    completed: '已通關',
    playing: '遊玩中',
    paused: '暫停',
    todo: '待遊玩'
}

// 新增：圖片載入狀態
const imgLoaded = ref(false)
</script>

<template>
    <div class="card relative z-0 w-[calc((100%-20px)/2)] md:w-[calc((100%-40px)/3)] shadow-md">
        <div class="bg-white rounded-sm overflow-hidden">
            <div :class="{ 'aspect-[4/3]': data.img }" class="relative">
                <span @click="editModal(false, data)"
                    class="edit shadow-2xl hover:opacity-80 material-symbols-outlined">border_color</span>

                <!-- Skeleton Loading -->
                <div v-if="data.img && !imgLoaded" class="skeleton absolute inset-0"></div>

                <!-- 圖片 -->
                <img v-if="data.img" :src="data.img" :alt="data.name" loading="lazy" @load="imgLoaded = true"
                    class="w-full h-full object-cover transition-opacity duration-300"
                    :class="imgLoaded ? 'opacity-100' : 'opacity-0'">

                <div v-if="data.status !== 'completed' && data.img"
                    class="text-sm bg-black/50 text-white text-center p-1 w-full absolute bottom-0">
                    {{ statusMap[data.status] }}
                </div>
            </div>

            <div class="p-5 flex flex-col gap-3">
                <div v-if="data.status !== 'completed' && !data.img"
                    class="text-white bg-[#FF4450] px-3 py-1 w-fit rounded-full text-sm ">
                    {{ statusMap[data.status] }}
                </div>
                <div class="text-[#19556D] font-bold">{{ data.name }}</div>
                <div v-if="data.note" class="text-gray-500 text-sm whitespace-pre-line">小筆記：<br>{{ data.note }}</div>
                <div :class="data.completedAt ? 'text-[#EDAA5F]' : 'text-gray-300'" class="text-xs">
                    <span v-if="data.startAt">Added · {{ data.startAt }}</span>
                    <span v-if="data.completedAt"><br>Cleared · {{ data.completedAt }}</span>
                </div>
                <div v-if="data.platform.length > 0 || data.category.length > 0" class="flex gap-2 flex-wrap">
                    <div v-for="(p, i) in data.platform" :key="p + i"
                        class="rounded-sm w-fit p-1 border border-gray-300 text-gray-300 text-xs cursor-pointer transition duration-300 hover:scale-110 hover:text-gray-500">
                        {{ p }}</div>
                    <div v-for="(c, i) in data.category" :key="c + i"
                        class="rounded-sm w-fit p-1 border border-gray-300 text-gray-300 text-xs cursor-pointer transition duration-300 hover:scale-110 hover:text-gray-500">
                        {{ c }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card::after {
    content: '';
    background-color: #d4d4d478;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    top: 0px;
    left: 0px;
    border-radius: 0.25rem;
    transition: 0.3s;
    border: 1px solid rgb(175, 175, 175);
}

.card:hover::after {
    top: 5px;
    left: 5px;
}

.edit {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    cursor: pointer;
    font-size: 20px;
    transform: translateY(-50px);
    transition: 0.3s;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 50%;
}

.card:hover .edit {
    transform: translateY(0px);
}

.skeleton {
    background: linear-gradient(90deg,
            #e5e5e5 25%,
            #f2f2f2 37%,
            #e5e5e5 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
    z-index: 10;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: -100% 0;
    }
}

@media screen and (max-width:1023px) {
    .edit {
        transform: translateY(0px);
    }
}

@media screen and (max-width:450px) {
    .card {
        width: 100%;
    }
}
</style>