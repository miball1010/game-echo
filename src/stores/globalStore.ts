import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', () => {
  //通知
  const message = ref({
    text: '',
    status: false,
    active: false,
  })

  let time: number | undefined = undefined
  function pushMessage(success: boolean, newMessage: string) {
    if (newMessage) {
      if (message.value.active) {
        message.value.active = false
        clearTimeout(time)
      }
      setTimeout(() => {
        message.value.text = newMessage
        message.value.status = success
        message.value.active = true
      }, 100)

      time = setTimeout(() => {
        message.value.active = false
      }, 3000)
    }
  }

  return {
    message,
    pushMessage,
  }
})
