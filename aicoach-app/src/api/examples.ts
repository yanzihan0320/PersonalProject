/**
 * HTTP 客户端使用示例
 *
 * 本文件展示了改造后的 HTTP 客户端的各种用法
 * 可在项目的任何地方参考这些示例
 */

import { httpClient } from '@/api'

// ==================
// 示例 1: 基础请求
// ==================

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

/**
 * 登录示例
 */
export async function exampleLogin(email: string, password: string) {
  try {
    const response = await httpClient.post<LoginResponse>('/api/auth/login', {
      email,
      password
    })

    console.log('登录成功:', response.user.name)
    return response
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

/**
 * 获取用户信息示例
 */
export async function exampleGetUserProfile() {
  try {
    const user = await httpClient.get<User>('/api/user/profile')
    console.log('获取用户信息成功:', user.name)
    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

/**
 * 更新用户信息示例
 */
export async function exampleUpdateProfile(userData: Partial<User>) {
  try {
    const updatedUser = await httpClient.put<User>('/api/user/profile', userData)
    console.log('更新成功:', updatedUser.name)
    return updatedUser
  } catch (error) {
    console.error('更新失败:', error)
    throw error
  }
}

// ==================
// 示例 2: 文件上传
// ==================

interface UploadResponse {
  fileId: string
  fileName: string
  filePath: string
  fileSize: number
}

/**
 * 上传简历示例
 */
export async function exampleUploadResume() {
  return new Promise<void>((resolve, reject) => {
    // 选择文件
    uni.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: async (res) => {
        try {
          const filePath = res.tempFilePaths[0]

          // 上传文件
          const result = await httpClient.upload<UploadResponse>(
            '/api/resume/upload',
            filePath,
            {
              name: 'resume',
              formData: {
                type: 'resume'
              }
            }
          )

          console.log('上传成功:', result.fileName)
          resolve()
        } catch (error) {
          console.error('上传失败:', error)
          reject(error)
        }
      },
      fail: (err) => {
        console.error('选择文件失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 上传头像示例
 */
export async function exampleUploadAvatar() {
  return new Promise<void>((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sourceType: ['camera', 'album'],
      success: async (res) => {
        try {
          const filePath = res.tempFilePaths[0]

          // 上传头像
          const result = await httpClient.upload<UploadResponse>(
            '/api/user/avatar',
            filePath,
            {
              name: 'avatar'
            }
          )

          console.log('上传成功:', result.filePath)
          resolve()
        } catch (error) {
          console.error('上传失败:', error)
          reject(error)
        }
      },
      fail: reject
    })
  })
}

// ==================
// 示例 3: 文件下载
// ==================

/**
 * 下载简历示例
 */
export async function exampleDownloadResume(resumeId: string) {
  try {
    // 下载文件
    const tempFilePath = await httpClient.download(
      `/api/resume/download?id=${resumeId}`
    )

    console.log('下载成功，临时路径:', tempFilePath)

    // 保存到本地存储
    return new Promise<string>((resolve, reject) => {
      uni.saveFile({
        tempFilePath,
        success: (res) => {
          console.log('保存成功:', res.savedFilePath)
          resolve(res.savedFilePath)
        },
        fail: reject
      })
    })
  } catch (error) {
    console.error('下载失败:', error)
    throw error
  }
}

// ==================
// 示例 4: 自定义配置
// ==================

/**
 * 长时间请求示例（自定义超时）
 */
export async function exampleLongRunningTask() {
  try {
    const result = await httpClient.post(
      '/api/task/generate-course',
      { jobId: '123' },
      {
        timeout: 120000  // 自定义超时 120 秒
      }
    )

    console.log('任务完成:', result)
    return result
  } catch (error) {
    console.error('任务失败:', error)
    throw error
  }
}

/**
 * 自定义请求头示例
 */
export async function exampleCustomHeader() {
  try {
    const result = await httpClient.get(
      '/api/data',
      {
        header: {
          'X-Custom-Header': 'custom-value',
          'X-Request-ID': 'request-123'
        }
      }
    )

    console.log('获取数据成功:', result)
    return result
  } catch (error) {
    console.error('获取数据失败:', error)
    throw error
  }
}

// ==================
// 示例 5: 错误处理
// ==================

/**
 * 完整的错误处理示例
 */
export async function exampleErrorHandling() {
  try {
    const user = await httpClient.get<User>('/api/user/profile')
    console.log('成功获取用户:', user)
    return user
  } catch (error) {
    // 注意：401/403 错误会在拦截器中自动处理，此处可能收不到
    if (error instanceof Error) {
      const message = error.message

      if (message.includes('401') || message.includes('403')) {
        console.log('认证已过期，请重新登录')
      } else if (message.includes('404')) {
        console.log('资源不存在')
      } else if (message.includes('500')) {
        console.log('服务器错误')
      } else {
        console.log('其他错误:', message)
      }

      // 显示用户友好的错误提示
      uni.showToast({
        title: message,
        icon: 'error',
        duration: 2000
      })
    }

    throw error
  }
}

// ==================
// 示例 6: 在 Vue 组件中使用
// ==================

/**
 * Vue 3 组件使用示例
 *
 * <template>
 *   <view>
 *     <button @click="loadUserData">加载用户信息</button>
 *     <text v-if="user">{{ user.name }}</text>
 *     <text v-else-if="loading">加载中...</text>
 *     <text v-else-if="error">{{ error }}</text>
 *   </view>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { httpClient } from '@/api'
 *
 * const user = ref<User | null>(null)
 * const loading = ref(false)
 * const error = ref('')
 *
 * async function loadUserData() {
 *   loading.value = true
 *   error.value = ''
 *
 *   try {
 *     user.value = await httpClient.get<User>('/api/user/profile')
 *   } catch (err) {
 *     if (err instanceof Error) {
 *       error.value = err.message
 *     }
 *   } finally {
 *     loading.value = false
 *   }
 * }
 * </script>
 */

export const componentExample = {
  // 组件在上面的注释中展示了
}

// ==================
// 导出所有示例函数
// ==================

export const examples = {
  exampleLogin,
  exampleGetUserProfile,
  exampleUpdateProfile,
  exampleUploadResume,
  exampleUploadAvatar,
  exampleDownloadResume,
  exampleLongRunningTask,
  exampleCustomHeader,
  exampleErrorHandling
}
