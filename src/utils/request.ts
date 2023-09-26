import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getLToken, getSToken } from '@/utils/storage'
import { showToast } from 'vant'
import { HttpCodeEnum } from '@/types/http-codes'

interface CustomAxiosInstance extends AxiosInstance {
  <T>(config: AxiosRequestConfig): Promise<{
    status: HttpCodeEnum
    msg: string
    data: T
    headers: any
  }>
}

const service: CustomAxiosInstance = axios.create({
  baseURL: '/zd-api',
  timeout: 5000
})

/**
 * 请求拦截
 */
service.interceptors.request.use(
  (config) => {
    // 统一的请求头设置
    config.headers['token'] = getLToken() || getSToken()
    config.headers['Content-Type'] = 'application/json;charset=utf-8'

    return config
  },
  (error) => {
    // 请求错误统一处理
    console.log(error, 'service.interceptors.request.error')
    return Promise.reject(error)
  }
)

/**
 *  响应拦截
 */
service.interceptors.response.use(
  async (response) => {
    // http状态码判断
    const { status, msg } = response.data
    if (status !== HttpCodeEnum.OK) {
      showToast(msg || 'Error')
    }
    return { ...response.data, headers: response.headers }
  },
  (error) => {
    console.log('service.interceptors.response.error' + error)
    showToast(error || 'Error')
    return Promise.reject(error)
  }
)

export default service
