import { ref } from 'vue'

/**
 * 防抖 Hook - 用于处理频繁触发的事件
 * @param callback 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function useDebounce(callback: (...args: any[]) => void, delay: number = 300) {
  let timeoutId: NodeJS.Timeout

  const debounced = (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }

  const cancel = () => clearTimeout(timeoutId)

  return { debounced, cancel }
}

/**
 * 节流 Hook - 用于限制函数执行频率
 * @param callback 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function useThrottle(callback: (...args: any[]) => void, delay: number = 300) {
  let lastTime = 0

  const throttled = (...args: any[]) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      callback(...args)
      lastTime = now
    }
  }

  return { throttled }
}
