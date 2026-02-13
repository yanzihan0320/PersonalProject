import { ref } from 'vue'

/**
 * 加载状态 Hook
 */
export function useLoading(initialValue: boolean = false) {
  const loading = ref(initialValue)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const startLoading = () => {
    loading.value = true
  }

  const stopLoading = () => {
    loading.value = false
  }

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading
  }
}
