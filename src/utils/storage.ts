import { TOKEN, USER_INFO } from '@/utils/constants'
import type { IUserInfo } from '@/types/user'
export function getLToken() {
  return localStorage.getItem(TOKEN)
}

export function setLToken(token: string) {
  localStorage.setItem(TOKEN, token)
}

export function getSToken() {
  return sessionStorage.getItem(TOKEN)
}

export function setSToken(token: string) {
  sessionStorage.setItem(TOKEN, token)
}

export function getUserInfo(): IUserInfo | null {
  const userInfo = localStorage.getItem(USER_INFO)
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return null
}

export function setUserInfo(userInfo: IUserInfo | any) {
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo))
}

export function clearData() {
  localStorage.clear()
  sessionStorage.clear()
}
