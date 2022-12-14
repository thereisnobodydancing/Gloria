import { defineStore } from 'pinia'

export default defineStore('form', () => {
  const form = ref({})
  return {
    form
  }
},{
  persist: true       // 支持持久化
})