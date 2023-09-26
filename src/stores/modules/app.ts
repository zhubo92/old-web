import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('app', () => {
  const loading = ref(false)

  return {
    loading,
  }
})
