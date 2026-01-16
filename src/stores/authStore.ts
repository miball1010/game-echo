import { defineStore } from 'pinia'
import { watch, reactive, ref } from 'vue'
import { useGlobalStore } from './globalStore.ts'
import { useGameStore } from '@/stores/gameStore'

import router from '@/router'
import { auth } from '@/services/firebase'
import { onAuthStateChanged, type User, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

export const useAuthStore = defineStore('auth', () => {
  const global = useGlobalStore()
  const game = useGameStore()

  const currentUser = ref<User | null>(null)
  const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  const loginStatus = reactive({
    status: 'login',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    loading: false
  })
  watch(() => loginStatus.status, () => {
    loginStatus.email = ''
    loginStatus.password = ''
    loginStatus.emailError = ''
    loginStatus.passwordError = ''
  })

  //登入狀態
  const loading = ref(true)
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    loading.value = false
    if (user) {
      await game.loadGameData()
    }
  })

  //驗證
  function verifyEmail() {
    if (loginStatus.email === '') {
      loginStatus.emailError = '請填寫 Email'
    }
    else if (!emailRegex.test(loginStatus.email)) {
      loginStatus.emailError = 'Email 格式錯誤'
    }
    else {
      loginStatus.emailError = ''
    }
  }

  function verifyPassword() {
    if (loginStatus.password.length < 6) {
      loginStatus.passwordError = '密碼至少6碼'
    }
    else {
      loginStatus.passwordError = ''
    }
  }

  //註冊
  const register = async () => {
    verifyEmail()
    verifyPassword()

    if (loginStatus.emailError !== '' || loginStatus.passwordError !== '') {
      return
    }

    try {
      loginStatus.loading = true
      await createUserWithEmailAndPassword(auth, loginStatus.email, loginStatus.password)
      loginStatus.status = 'login'
      router.push('/')
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        loginStatus.emailError = '此 Email 已被註冊'
      }
      else {
        global.pushMessage(false, '註冊失敗：' + error.code)
      }
    }
    finally {
      loginStatus.loading = false
    }
  }

  //忘記密碼
  const resetPassword = async () => {
    verifyEmail()

    if (loginStatus.emailError !== '') {
      return
    }

    try {
      loginStatus.loading = true
      await sendPasswordResetEmail(auth, loginStatus.email)
      global.pushMessage(true, "重設密碼信已寄到你的信箱，請查收（含垃圾郵件）")
      loginStatus.status = 'login'
    } catch (error: any) {
      global.pushMessage(false, '失敗：' + error.code)
    }
    finally {
      loginStatus.loading = false
    }
  }

  // email登入
  const login = async () => {
    verifyEmail()
    verifyPassword()
    if (loginStatus.emailError !== '' || loginStatus.passwordError !== '') {
      return
    }

    try {
      loginStatus.loading = true
      await signInWithEmailAndPassword(auth, loginStatus.email, loginStatus.password)
      router.push('/')
    } catch (error: any) {
      global.pushMessage(false, '登入失敗：' + error.code)
    }
    finally {
      loginStatus.loading = false
    }
  }

  //Google登入
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      currentUser.value = result.user
      await game.loadGameData()
      router.push('/')
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        global.pushMessage(false, 'Google登入視窗已被關閉')
      }
      else {
        global.pushMessage(false, 'Google 登入錯誤：' + error.code)
      }
    }
  }

  //測試帳號登入
  function testLogin() {
    loginStatus.email = 'test@gmail.com'
    loginStatus.password = 'abc123'
    login()
  }
  //登出
  async function logout() {
    try {
      await signOut(auth)
      currentUser.value = null
      router.push('/login').then(() => game.reset())
    } catch (error: any) {
      global.pushMessage(false, '登出失敗：' + error.code)
    }
  }

  return {
    currentUser, loading,
    loginStatus, register, resetPassword, login, logout, googleLogin, testLogin
  }
})
