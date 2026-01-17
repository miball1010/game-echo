<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { searchText } = storeToRefs(store)
const { useFilter } = store
</script>

<template>
    <label class="block relative mb-2 px-2">
        <input placeholder="搜尋 ..." id="search" type="text" v-model="searchText" @keyup.enter="useFilter('search')"
            class="text-sm text-white outline-none w-full px-2 py-1 border-b border-b-[#528AA4]">
        <button @click="useFilter('search')" class="absolute top-1 right-3 cursor-pointer hover:opacity-80">
            <span class="text-[#528AA4] material-symbols-outlined ">search</span>
        </button>
    </label>
</template>

<style scoped>
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #3f5c68 inset;
    -webkit-text-fill-color: #ffffff;
    transition: background-color 5000s ease-in-out 0s;
}

input:-moz-autofill {
    box-shadow: 0 0 0 #ffffff00 inset;
    -moz-text-fill-color: #ffffff;
}
</style>