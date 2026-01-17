<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/globalStore.ts'
const store = useGlobalStore()
const { message } = storeToRefs(store)
</script>

<template>
    <div :class="message.active ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-1 z-[-1]'"
        class="text-gray-600 border border-gray-200 fixed bottom-7 left-6 bg-white p-4 flex gap-3 rounded-sm shadow-md transition-all duration-500">
        <span v-if="message.status" class="text-green-500 material-symbols-outlined">check_circle</span>
        <span v-else class="text-[#FF4450] material-symbols-outlined">cancel</span>
        {{ message.text }}
    </div>
</template>