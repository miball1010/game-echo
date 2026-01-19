<script setup lang="ts">
import type { MenuNode } from '@/types/game'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { nowNode } = storeToRefs(store)
const { useFilter } = store

import { ref, watch } from 'vue'
const props = defineProps<{
  menu: MenuNode[]
  layer: number
  parentId: string | null
}>()

const localNowNode = ref<MenuNode | null>(null)

function choose(item: MenuNode) {
  nowNode.value = item
  localNowNode.value = item
  useFilter()
}

watch(() => nowNode.value?.status, (status) => {
  if (status === 'search')
    localNowNode.value = null
})

const itemClass = (item: MenuNode, layer: number) => {
  if (layer === 1) {
    return {
      'bg-white': localNowNode.value?.id === item.id,
      'hover:text-[#528AA4]': true
    }
  } else if (layer === 2) {
    return {
      'bg-gray-200': nowNode.value?.id === item.id,
      'hover:bg-gray-100 rounded-sm mt-2': true
    }
  }
  return ''
}
</script>

<template>
  <div :class="{
    'bg-white/80 rounded-sm py-0 overflow-scroll shadow-sm max-h-[calc(100%-50px)] md:max-h-[50vw]': layer === 1,
    'bg-white px-3 py-2': layer === 2
  }">
    <div v-for="item in menu">
      <div @click="choose(item)" class="text-sm px-5 py-3 text-[#19556D] flex justify-between cursor-pointer"
        :class="itemClass(item, layer)">
        {{ item.statusCN }}
        <span v-if="item.children" class="material-symbols-outlined">arrow_right</span>
      </div>

      <div v-if="item.children && localNowNode?.id === item.id">
        <CategoryNode :menu="item.children" :layer="layer + 1" :parentId="item.id" />
      </div>
    </div>
  </div>
</template>