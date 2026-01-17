<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { confirm } = storeToRefs(store)
const { doubleCheck } = store
</script>

<template>
  <div class="bg-black/45 fixed w-full h-screen top-0 left-0 z-80 flex justify-center items-center"
    v-show="confirm.show">
    <transition name="fadeup">
      <div v-if="confirm.show" class="bg-white w-[90%] max-w-[400px] rounded-sm shadow-lg p-5">
        <div class="font-bold my-12 text-center text-[#19556D]">{{ confirm.msg }}</div>
        <div class="flex justify-end gap-5">
          <button class="btn bg-gray-300  hover:opacity-90" @click="confirm.show = false">取消</button>
          <button class="btn bg-[#FF4450] hover:opacity-90" @click="doubleCheck">
            非常確定
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>