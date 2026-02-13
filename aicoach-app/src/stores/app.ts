import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const locale = ref('zh')

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setLocale = (lang: string) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  const initializeLocale = () => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
      locale.value = savedLocale
    }
  }

  return {
    loading,
    locale,
    setLoading,
    setLocale,
    initializeLocale
  }
})
