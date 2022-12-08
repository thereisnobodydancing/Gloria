import { defineStore } from 'pinia'

export default defineStore('template', () => {
  const form = ref({})
  return {
    form
  }
},{
  persist: true       // 支持持久化
})