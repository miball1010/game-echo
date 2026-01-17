<script setup lang="ts">
import CategoryTree from '@/components/filter/CategoryTree.vue'
import GameCardBox from '@/components/game/GameCardBox.vue'
import EditGameModal from '@/components/game/EditGameModal.vue'
import DoubleCheck from '@/components/common/DoubleCheck.vue'
import Search from '@/components/filter/Search.vue'
import Logo from '@/components/common/Logo.vue'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'
const AuthStore = useAuthStore()
const { logout } = AuthStore
import { useGameStore } from '@/stores/gameStore.ts'
const store = useGameStore()
const { menuIsOpen } = storeToRefs(store)
const {  editModal, menuControl } = store
</script>

<template>
    <div class="bg-[#104459] w-full min-h-screen">
        <!-- 手機版 -->
        <div class="bg-[#082F3F]/80 w-full fixed lg:absolute top-0 z-10 shadow-lg backdrop-blur-md">
            <div class="w-[90%] max-w-[1200px] py-5 mx-auto flex items-center justify-between lg:justify-center">
                <Logo />
                <button @click="menuControl"
                    class="flex lg:hidden text-white items-center cursor-pointer transition duration-300 hover:scale-110">
                    <span v-show="!menuIsOpen" class="material-symbols-outlined">menu</span>
                    <span v-show="menuIsOpen" class="material-symbols-outlined">close</span>
                </button>
            </div>
            <transition name="fade">
                <div v-if="menuIsOpen"
                    class="block lg:hidden bg-white/20 px-3 sm:px-8 py-2 sm:py-5 relative h-[calc(100dvh-72px)]">
                    <Search />
                    <CategoryTree />
                </div>
            </transition>
        </div>

        <!-- 電腦版 -->
        <div
            class="relative w-[90%] max-w-[1200px] mx-auto pt-25 lg:pt-30 pb-10 flex flex-col lg:flex-row justify-between gap-10">
            <div class="hidden lg:block lg:w-fit min-w-[200px] relative lg:sticky top-0 lg:top-5 h-full">
                <Search />
                <CategoryTree />
            </div>

            <div class="w-full">
                <GameCardBox />
            </div>
        </div>
    </div>

    <div class="fixed bottom-5 right-5 flex flex-col gap-3">
        <button @click="editModal(true)" class="side-btn">新增＋</button>
        <button @click="logout" class="side-btn">登出</button>
    </div>

    <EditGameModal />
    <DoubleCheck />
</template>
