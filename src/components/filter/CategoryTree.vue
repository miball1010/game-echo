<script setup lang="ts">
import CategoryNode from '@/components/filter/CategoryNode.vue'

import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { menu } = storeToRefs(store)
</script>

<template>
            <CategoryNode :menu="menu" :layer="1" :parentId="null" />
</template>