/**
 * API 基础配置 - uni.request 包装层
 * 提供跨平台 HTTP 请求能力（iOS/Android/H5/小程序）
 */

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  data?: any
  header?: Record<string, string>
  timeout?: number
  [key: string]: any
}

interface UploadConfig {
  filePath: string
  name?: string
  header?: Record<string, string>
  formData?: Record<string, any>
  timeout?: number
}

interface DownloadConfig {
  header?: Record<string, string>
  timeout?: number
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api'
const API_TIMEOUT = 25000

class HttpClient {
  private baseURL: string = API_BASE_URL
  private timeout: number = API_TIMEOUT

  /**
   * 请求拦截器：处理请求前的数据
   */
  private async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
    // 1. 添加认证信息
    const token = uni.getStorageSync('auth_token') || localStorage.getItem('auth_token')
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }

    // 2. 设置通用请求头
    config.header = {
      'Content-Type': 'application/json',
      'tenant-id': '1',
      ...config.header
    }

    // 3. 补充基础配置
    config.timeout = config.timeout || this.timeout
    return config
  }

  /**
   * 响应拦截器：处理响应数据
   */
  private async responseInterceptor(response: any): Promise<any> {
    // response = [error, response]
    const [error, res] = response

    // 处理网络错误
    if (error) {
      console.error('HTTP Request Error:', error)
      return Promise.reject(new Error(error.message || '网络请求失败'))
    }

    // 验证HTTP状态码
    const statusCode = res?.statusCode || res?.status || 200
    if (statusCode >= 400) {
      // 处理 401/403 - 自动登出
      if (statusCode === 401 || statusCode === 403) {
        console.warn('认证失败，正在重定向到登录页面')
        try {
          // 清除认证信息
          uni.removeStorageSync('auth_token')
          localStorage.removeItem('auth_token')
          // 重定向到登录页
          uni.redirectTo({ url: '/pages/login/index' })
        } catch (e) {
          console.error('登出失败:', e)
        }
      }

      // 构造错误对象
      const errorData = res?.data || res
      const errorMsg = errorData?.message || `HTTP ${statusCode}`
      return Promise.reject(new Error(errorMsg))
    }

    // 返回响应数据
    return res?.data || res
  }

  /**
   * 核心请求方法
   */
  private async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 请求前处理
      const finalConfig = await this.requestInterceptor(config)

      // 发起请求
      const response = await new Promise((resolve) => {
        uni.request({
          url: finalConfig.url.startsWith('http')
            ? finalConfig.url
            : this.baseURL + finalConfig.url,
          method: finalConfig.method || 'GET',
          data: finalConfig.data,
          header: finalConfig.header,
          timeout: finalConfig.timeout,
          success: (res) => resolve([null, res]),
          fail: (err) => resolve([err, null])
        })
      })

      // 响应后处理
      return await this.responseInterceptor(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'GET'
    })
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      data
    })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      data
    })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'DELETE'
    })
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'PATCH',
      data
    })
  }

  /**
   * 文件上传
   * @param url 上传URL
   * @param filePath 文件本地路径
   * @param options 上传选项
   */
  async upload<T = any>(url: string, filePath: string, options: Omit<UploadConfig, 'filePath'> = {}): Promise<T> {
    try {
      // 添加认证信息到 header
      const token = uni.getStorageSync('auth_token') || localStorage.getItem('auth_token')
      const header: Record<string, string> = {
        ...options.header
      }
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }

      // 发起上传
      const response = await new Promise<any>((resolve, reject) => {
        uni.uploadFile({
          url: url.startsWith('http') ? url : this.baseURL + url,
          filePath,
          name: options.name || 'file',
          header,
          formData: options.formData,
          timeout: options.timeout || this.timeout,
          success: (res) => {
            // 解析响应
            try {
              const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
              if (res.statusCode >= 400) {
                reject(new Error(data?.message || `HTTP ${res.statusCode}`))
              } else {
                resolve(data?.data || data)
              }
            } catch (e) {
              resolve(res.data)
            }
          },
          fail: (err) => reject(new Error(err.errMsg || '上传失败'))
        })
      })

      return response as T
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * 文件下载
   * @param url 下载URL
   * @param options 下载选项
   */
  async download(url: string, options: DownloadConfig = {}): Promise<string> {
    try {
      // 添加认证信息到 header
      const token = uni.getStorageSync('auth_token') || localStorage.getItem('auth_token')
      const header: Record<string, string> = {
        ...options.header
      }
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }

      // 发起下载
      const response = await new Promise<string>((resolve, reject) => {
        uni.downloadFile({
          url: url.startsWith('http') ? url : this.baseURL + url,
          header,
          timeout: options.timeout || this.timeout,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath)
            } else {
              reject(new Error(`HTTP ${res.statusCode}`))
            }
          },
          fail: (err) => reject(new Error(err.errMsg || '下载失败'))
        })
      })

      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * 设置基础URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url
  }

  /**
   * 设置请求超时
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout
  }
}

export const httpClient = new HttpClient()
export default httpClient
