<script setup lang="ts">
import Logo from '@/components/common/Logo.vue'
import bg from '@/assets/bg.jpg'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'
const store = useAuthStore()
const { loginStatus } = storeToRefs(store)
const { register, resetPassword, login, googleLogin, testLogin } = store
</script>

<template>
    <!-- 背景圖 -->
    <img :src="bg" alt="電玩背景" aria-hidden="true" class="fixed top-0 w-full h-full object-cover" />

    <div class="relative z-10 min-h-screen">
        <div class="absolute top-0 w-full h-full bg-[#082530]/55 backdrop-blur-[5px] z-[-1]"></div>

        <transition name="slide-fade" mode="out-in">

            <!-- 登入 -->
            <div v-if="loginStatus.status === 'login'" key="login"
                class="box w-[90%] max-w-sm p-8 bg-gray-200 rounded-sm shadow-lg">
                <Logo />
                <div class="text-[#19556D] font-bold text-center mb-5 mt-2">登入帳號</div>

                <div class="mb-4">
                    <input v-model="loginStatus.email" type="email" placeholder="Email" autocomplete="email"
                        class="w-full mb-1 p-2 bg-white text-sm outline-none" />
                    <div class="text-xs text-[#FF4450]">{{ loginStatus.emailError }}</div>
                </div>

                <div class="mb-3">
                    <input v-model="loginStatus.password" type="password" placeholder="密碼至少6碼"
                        autocomplete="current-password" class="w-full mb-1 p-2 bg-white text-sm outline-none" />
                    <div class="text-xs text-[#FF4450]">{{ loginStatus.passwordError }}</div>
                </div>

                <div class="flex justify-end text-sm text-[#528AA4] mb-0.5">
                    <button @click="loginStatus.status = 'password'"
                        class="cursor-pointer text-[#528AA4] hover:underline">忘記密碼?</button>
                </div>

                <button @click="login" class="btn w-full bg-[#19556D] hover:opacity-90">登入</button>

                <hr class="my-5 text-gray-400">
                <button @click="testLogin"
                    class="btn w-full mb-2 bg-[#FF4450] flex items-center justify-center gap-2 hover:opacity-90">
                    <span class="material-symbols-outlined">key</span>
                    以測試帳號登入 <br>（ 內有100筆資料 ）
                </button>

                <button @click="googleLogin"
                    class="btn w-full bg-[#EDAA5F] flex items-center justify-center gap-2 mb-2 hover:opacity-90">
                    <span class="material-symbols-outlined">g_mobiledata_badge</span>
                    以 Google 帳號登入
                </button>

                <div class="text-sm flex justify-center gap-2">
                    <span class="text-gray-500">還沒有帳戶？</span>
                    <button @click="loginStatus.status = 'register'"
                        class="cursor-pointer text-[#528AA4] hover:underline">註冊帳號</button>
                </div>
            </div>

            <!-- 註冊 -->
            <div v-else-if="loginStatus.status === 'register'" key="register"
                class="box w-[90%] max-w-sm p-8 bg-gray-200 rounded-sm shadow-lg">
                <Logo />
                <div class="text-[#19556D] font-bold text-center mb-5 mt-2">註冊帳號</div>

                <div class="mb-4">
                    <input v-model="loginStatus.email" type="email" placeholder="Email" autocomplete="email"
                        class="w-full mb-1 p-2 bg-white text-sm outline-none" />
                    <div class="text-xs text-[#FF4450]">{{ loginStatus.emailError }}</div>
                </div>

                <div class="mb-4">
                    <input v-model="loginStatus.password" type="password" placeholder="密碼至少6碼"
                        autocomplete="new-password" class="w-full mb-1 p-2 bg-white text-sm outline-none" />
                    <div class="text-xs text-[#FF4450]">{{ loginStatus.passwordError }}</div>
                </div>

                <button :disabled="loginStatus.loading" @click="register"
                    :class="loginStatus.loading ? 'btn-disabled opacity-90' : ' hover:opacity-90'"
                    class="btn mb-2 w-full bg-[#19556D]">註冊</button>

                <div class="text-center">
                    <button @click="loginStatus.status = 'login'"
                        class="text-sm cursor-pointer text-[#528AA4] hover:underline">
                        返回
                    </button>
                </div>
            </div>

            <!-- 忘記密碼 -->
            <div v-else key="password" class="box w-[90%] max-w-sm p-8 bg-gray-200 rounded-sm shadow-lg">
                <Logo />
                <div class="text-[#19556D] font-bold text-center mb-5 mt-2">忘記密碼</div>

                <div class="mb-4">
                    <input v-model="loginStatus.email" type="email" placeholder="Email" autocomplete="email"
                        class="w-full mb-1 p-2 bg-white text-sm outline-none" />
                    <div class="text-xs text-[#FF4450]">{{ loginStatus.emailError }}</div>
                </div>

                <button :disabled="loginStatus.loading" @click="resetPassword"
                    :class="loginStatus.loading ? 'btn-disabled opacity-90' : ' hover:opacity-90'"
                    class="btn mb-2 w-full bg-[#19556D]">確認</button>

                <div class="text-center">
                    <button @click="loginStatus.status = 'login'"
                        class="text-sm cursor-pointer text-[#528AA4] hover:underline">
                        返回
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.box {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    opacity: 1;
}

.slide-fade-enter-from {
    transform: translate(-50%, -20%);
    opacity: 0;
}

.slide-fade-enter-to {
    transform: translate(-50%, -50%);
    opacity: 1;
}

.slide-fade-leave-from {
    transform: translate(-50%, -50%);
    opacity: 1;
}

.slide-fade-leave-to {
    transform: translate(-50%, -70%);
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: 0.3s ease;
}
</style>