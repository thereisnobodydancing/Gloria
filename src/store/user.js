import { defineStore } from 'pinia'

export default defineStore('user', () => {
  const user = ref({})
  return {
    user
  }
},{
  persist: true       // 支持持久化
})