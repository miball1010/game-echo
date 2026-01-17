<script setup lang="ts">
import GameCard from '@/components/game/GameCard.vue'
import InlineLoading from '@/components/common/InlineLoading.vue'

import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { visibleGames, gameIsLoading } = storeToRefs(store)
const { loadMore } = store

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
    nextTick(() => {
        observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry && entry.isIntersecting) {
                    loadMore()
                }
            },
            { rootMargin: '200px' }
        )
        if (trigger.value) observer.observe(trigger.value)
    })
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
    <transition-group name="fade">
        <div v-if="gameIsLoading">
            <div class="text-white text-center bg-white/10 p-5 rounded-sm">
                <InlineLoading />
            </div>
        </div>
        <div v-else>
            <div v-if="visibleGames.length > 0" class=" flex flex-wrap items-start gap-[20px]">
                <GameCard v-for="item in visibleGames" :key="item.id" :data="item" />
            </div>
            <div v-else class="text-white text-center bg-white/10 p-5 rounded-sm">目前尚未有遊戲
            </div>
        </div>
    </transition-group>

    <!-- 底部觸發 -->
    <div v-show="visibleGames.length > 0">
        <div ref="trigger" class="h-1"></div>
    </div>
</template>