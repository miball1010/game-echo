import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from './authStore.ts'
import { useGlobalStore } from './globalStore.ts'
import type { Game, MenuNode } from '@/types/game.ts'
import { db } from '@/services/firebase.ts'
import { Timestamp, query, deleteDoc, orderBy, doc, getDocs, addDoc, collection, updateDoc, writeBatch } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'
// import sampleGamesJSON from '@/assets/data2.json'

export const useGameStore = defineStore('game', () => {

  const authStore = useAuthStore()
  const global = useGlobalStore()

  const games = ref<Game[]>([])
  const gameFilter = ref<Game[]>([])
  const gameIsLoading = ref(true)

  //重置資料
  function reset() {
    games.value = []
    gameFilter.value = []
    menuIsOpen.value = false
    nowNode.value = null
    searchText.value = ''
    visibleCount.value = 10
  }

  //抓取資料
  async function loadGameData() {
    gameIsLoading.value = true
    const userGames = await fetchUserGames()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    games.value = userGames
    gameFilter.value = userGames
    gameIsLoading.value = false
    if (nowNode.value) {
      useFilter()
    }
  }

  async function fetchUserGames() {
    if (!authStore.currentUser) return []

    try {
      const gamesCol = collection(db, 'users', authStore.currentUser.uid, 'games')
      const q = query(gamesCol, orderBy('updatedAt', 'desc'))
      const snapshot = await getDocs(q)

      const games: Game[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Game))
      return games
    } catch (error: any) {
      global.pushMessage(false, "抓取遊戲資料錯誤：" + error.message)
      return []
    }
  }

  //menu種類
  const statusOrder = ref<StatusItem[]>([
    { status: 'completed', statusCN: '已通關' },
    { status: 'playing', statusCN: '遊玩中' },
    { status: 'paused', statusCN: '暫停' },
    { status: 'todo', statusCN: '待遊玩' }
  ])

  interface StatusItem {
    status: string,
    statusCN: string
  }

  //動態生成menu
  const menu = computed<MenuNode[]>(() => {
    const result: MenuNode[] = [{ 'id': 'all', status: 'all', statusCN: '全部' }]

    statusOrder.value.forEach((status) => {
      const gameStatus = games.value.filter(g => g.status === status.status)
      const categorySet = new Set<string>()

      gameStatus.forEach(g => { g.category.forEach(c => categorySet.add(c)) })
      result.push({
        id: status.status,
        status: status.status,
        statusCN: status.statusCN,
        children: categorySet.size ? Array.from(categorySet).map(c => ({
          id: `${status.status}-${c.replace(/\s+/g, '_')}`,
          statusCN: c,
        })) : undefined
      })
    })
    return result
  })

  //openMenu
  const menuIsOpen = ref(false)
  function menuControl() {
    if (menuIsOpen.value) {
      menuIsOpen.value = false
      // document.body.style.overflow = ''
    }
    else {
      menuIsOpen.value = true
      // document.body.style.overflow = 'hidden'
    }
  }
  //篩選game
  const nowNode = ref<MenuNode | null>(null)
  const searchText = ref<string>('')
  const firstFilter = ref<Game[]>([])

  function useFilter() {
    visibleCount.value = 10
    if (nowNode.value?.status === 'search') {//搜尋
      gameFilter.value = games.value.filter(g => g.name.toLowerCase().includes(searchText.value.toLowerCase()))
    }
    else if (nowNode.value?.status === 'all') {//全部
      gameFilter.value = games.value
    }
    else if (nowNode.value?.status) {//大類
      firstFilter.value = games.value.filter(g => g.status === nowNode.value!.status)
      gameFilter.value = firstFilter.value
      visibleCount.value = Math.min(10, gameFilter.value.length)
      // 大類不執行menuControl()
      return
    }
    else {//小類
      gameFilter.value = firstFilter.value.filter(g => g.category.includes(nowNode.value!.statusCN))
    }
    menuControl()
    visibleCount.value = Math.min(10, gameFilter.value.length)
  }

  //滾動式渲染
  const visibleCount = ref(10)

  const visibleGames = computed(() =>
    gameFilter.value.slice(0, visibleCount.value)
  )

  function loadMore() {
    if (visibleCount.value < gameFilter.value.length) {
      visibleCount.value = Math.min(visibleCount.value + 10, gameFilter.value.length)
    }
  }

  //編輯遊戲資料 modal
  const editData = ref<Game>({
    img: '',
    name: '',
    status: '',
    platform: [],
    note: '',
    completedAt: '',
    startAt: '',
    category: []
  })

  const modalIsOpen = ref<boolean>(false)
  const isNew = ref<boolean>(false)
  const editStatus = reactive<EditStatus>({
    nameError: '',
    statusError: '',
    loading: false
  })

  interface EditStatus {
    nameError: string
    statusError: string
    loading: boolean
  }

  function editModal(status: boolean, data?: Game) {
    modalIsOpen.value = true
    document.body.style.overflow = 'hidden'
    isNew.value = status
    if (isNew.value) {
      editData.value = {
        img: '',
        name: '',
        status: '',
        platform: [],
        note: '',
        completedAt: '',
        startAt: '',
        category: []
      }
    }
    else {
      editData.value = JSON.parse(JSON.stringify(data))
    }
  }

  function closeModal() {
    modalIsOpen.value = false
    editStatus.nameError = ''
    editStatus.statusError = ''
    document.body.style.overflow = ''
  }

  //按下送出遊戲資料
  async function submit() {
    //檢查有無填寫
    editData.value?.name === '' ? editStatus.nameError = '遊戲名稱不得為空' : editStatus.nameError = ''
    editData.value?.status === '' ? editStatus.statusError = '請選擇遊戲進度' : editStatus.statusError = ''

    if (editStatus.nameError !== '' || editStatus.statusError !== '') {
      return
    }

    //確認可以送出
    const uid = authStore.currentUser?.uid
    if (!uid) return

    const formattedData = {
      ...editData.value,
      startAt: formatDate(editData.value.startAt),
      completedAt: formatDate(editData.value.completedAt),
      updatedAt: Timestamp.now()
    }

    try {
      editStatus.loading = true
      if (isNew.value) {
        await addDoc(collection(db, 'users', uid, 'games'), formattedData)
        global.pushMessage(true, "儲存成功")
      }
      else {
        const gameId = editData.value.id
        const docRef = doc(db, 'users', uid, 'games', String(gameId))
        await updateDoc(docRef, formattedData)
        global.pushMessage(true, "更新成功")
      }
      closeModal()
      await loadGameData()
    } catch (error: any) {
      global.pushMessage(false, "儲存遊戲時出錯：" + error.message)
    }
    finally {
      editStatus.loading = false
    }
  }

  //日期轉換
  function formatDate(
    value: string | Date | null): string | null {
    if (value === null) return null
    if (value instanceof Date) {
      return value.toISOString().split('T')[0] ?? null
    }
    return value
  }

  //刪除遊戲
  const confirm = reactive<ConfirmState>({
    show: false,
    msg: ''
  })

  interface ConfirmState {
    show: boolean
    msg: string
  }

  function deleteGame() {
    confirm.msg = `你確定要刪除 ${editData.value.name} 嗎?`
    confirm.show = true
  }

  async function doubleCheck() {
    confirm.show = false

    const uid = authStore.currentUser?.uid
    if (!uid) return

    try {
      const gameId = editData.value.id
      const docRef = doc(db, 'users', uid, 'games', String(gameId))
      await deleteDoc(docRef)
      global.pushMessage(true, "遊戲已刪除")
      closeModal()
      await loadGameData()
    } catch (error: any) {
      global.pushMessage(false, "刪除遊戲失敗：" + error.message)
    }
  }

  //大量新增
  // setTimeout(()=>{
  //   addGamesBatch(auth.currentUser!.uid)
  // },2000)
  // const auth = getAuth()
  // async function addGamesBatch(uid: string) {
  //   if (!uid) return
  //   const batch = writeBatch(db)
  //   const gamesCol = collection(db, 'users', uid, 'games')
  //   sampleGamesJSON.forEach((item) => {
  //     const formattedData = {
  //       ...item,
  //       startAt: item.startAt ? formatDate(item.startAt) : null,
  //       completedAt: item.completedAt ? formatDate(item.completedAt) : null,
  //       updatedAt: Timestamp.now()
  //     }
  //     const docRef = doc(gamesCol) // 自動生成 id
  //     batch.set(docRef, formattedData)
  //   })
  //   try {
  //     await batch.commit()
  //     console.log('批次新增成功')
  //   } catch (error: any) {
  //     console.error('批次新增失敗:', error.message)
  //   }
  // }

  return {
    reset,
    games, gameIsLoading, loadGameData, loadMore,
    menu, menuIsOpen, menuControl,
    nowNode, searchText, visibleGames, useFilter,
    modalIsOpen, statusOrder, editData, isNew, editStatus, confirm, editModal, closeModal, submit, deleteGame, doubleCheck
  }
})