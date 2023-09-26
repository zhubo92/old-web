import {
  getCUserToken,
  getCWXSignature,
  getParentOrTeachToken,
  verifyTokenRequest,
  weixinLoginRequest,
} from '@/api/user'
import wx from 'weixin-js-sdk'
import { HttpCodeEnum } from '@/types/http-codes'
import { showToast } from 'vant'
import { clearData, getLToken, setSToken, setLToken, setUserInfo } from '@/utils/storage'

export function getImageUrl(name: string) {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}

interface IDocumentElement extends HTMLElement {
  requestFullscreen(): Promise<void>

  mozRequestFullScreen(): void

  webkitRequestFullscreen(): void

  msRequestFullscreen(): void
}

/**
 * 浏览器开启全屏
 */
export async function openFullscreen() {
  const ele = document.documentElement as IDocumentElement
  if (ele.requestFullscreen) {
    await ele.requestFullscreen()
  } else if (ele.mozRequestFullScreen) {
    /* Firefox */
    ele.mozRequestFullScreen()
  } else if (ele.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    ele.webkitRequestFullscreen()
  } else if (ele.msRequestFullscreen) {
    /* IE/Edge */
    ele.msRequestFullscreen()
  }
}

interface IDocument extends globalThis.Document {
  exitFullscreen(): Promise<void>

  mozCancelFullScreen(): void

  webkitExitFullscreen(): void

  msExitFullscreen(): void
}

/**
 * 浏览器关闭全屏
 */
export async function closeFullscreen() {
  const doc = document as IDocument
  if (doc.exitFullscreen) {
    await doc.exitFullscreen()
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen()
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen()
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen()
  }
}

/**
 * 当前环境是否是微信浏览器
 */
export function isWeixinBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

/**
 * 在APP中跳转APP页面的方法
 */
export function navAppPage(
  route: string,
  error: null | Function = null,
  callback = '',
  replace = false,
) {
  callAppFc('navAppPage', { route, callback, replace }, error)
}

export function popPage() {
  callAppFc('popPage')
}

export function returnPage() {
  callAppFc('returnPage')
}

export function shareToFriendForReward(params: {
  title: string
  imgUrl: string
  inviteCode: string
}) {
  callAppFc('shareToFriendForReward', params)
}

export function shareCommonCourse(course: any) {
  callAppFc('shareCommonCourse', { course })
}

/**
 * 调用app方法
 */
export function callAppFc(event: any, params = {}, error: null | Function = null) {
  if (!isWeixinBrowser()) {
    console.log(event, params, 'callAppFc')
    try {
      window[event]['postMessage'](JSON.stringify(params))
    } catch (err) {
      if (error) error()
      console.log(err, event)
    }
  }
}

/**
 * 请求 app token
 */
export function getTestToken(phone = '15614410020', code = '5566', type = 'c') {
  return new Promise((resolve) => {
    if (type === 'c') {
      getCUserToken(phone, code).then((res) => {
        const { data, status } = res
        console.log(data, 'data')
        if (status === HttpCodeEnum.OK) {
          setSToken(data.accessToken)
          resolve(data.accessToken)
        }
      })
    } else {
      getParentOrTeachToken(phone, code).then((res) => {
        const { data, status } = res
        if (status === HttpCodeEnum.OK) {
          if (type === 'parent') {
            setSToken(data.parentAccessToken)
            resolve(data.parentAccessToken)
          } else if (type === 'teach') {
            setSToken(data.teacherAccessToken)
            resolve(data.teacherAccessToken)
          }
        }
      })
    }
  })
}

export async function verifyToken() {
  const res = await verifyTokenRequest()
  if (res.status === HttpCodeEnum.UNAUTHORIZED) {
    clearData()
    return res
  }
}

export function getQueryString(name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg) // 获取url中"?"符后的字符串并正则匹配
  let context = ''
  if (r != null) {
    context = r[2]
  }
  r = null
  return context == null || context == '' || context == 'undefined' ? '' : context
}

export function getWXCode(appid = 'wxe87236d542cd0f94') {
  const { origin, pathname, href } = window.location
  const redirect_uri = encodeURIComponent(`${origin}${pathname}#${href.split('#')[1]}`)
  window.location.replace(
    `https://open.weixin.qq.com/connect/oauth2/authorize?&appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`,
  )
}

export function weixinLogin(authData: any): Promise<{ status: number }> {
  // 登录埋点
  const { aplus_queue } = window as any
  aplus_queue.push({
    action: 'aplus.record',
    arguments: ['weixinLogin', 'CLK', authData],
  })

  return new Promise((resolve) => {
    weixinLoginRequest(authData).then((res) => {
      const { status, data, headers } = res
      if (status === 200) {
        setLToken(headers.token)
        setUserInfo(data)
        resolve(res)
      } else {
        showToast('微信登录失败')
      }
    })
  })
}

/**
 * 获取token
 */
export async function getToken() {
  return new Promise((resolve) => {
    if (isWeixinBrowser()) {
      const lToken = getLToken()
      if (lToken) {
        verifyToken().then((res) => {
          if (res?.status === HttpCodeEnum.OK) {
            resolve(true)
          } else {
            getWXCode()
          }
        })
      } else {
        const code = getQueryString('code')
        if (code) {
          weixinLogin({ code }).then((res) => {
            if (res?.status === 200) resolve(true)

            const { origin, pathname, hash } = window.location
            location.replace(`${origin}${pathname}${hash}`)
          })
        } else {
          getWXCode()
        }
      }
    } else {
      callAppFc('getToken')

      const errTimer = setTimeout(() => {
        getTestToken().then(() => {
          resolve('')
        })
      }, 1)

      const clear = () => {
        clearTimeout(errTimer)
      }

      ;(window as any).returnToken = (token: string) => {
        if (token) {
          clear()
          setSToken(token)
          resolve(token)
        }
      }
    }
  })
}

/**
 * 注册wx
 */
export async function registerWxOpenLaunchApp(callback?: () => void, request = getCWXSignature) {
  return new Promise((resolve) => {
    request().then((res) => {
      const { data, status } = res
      if (status === HttpCodeEnum.OK) {
        const { debug, signature, appId, nonceStr, timestamp } = data
        wx.config({
          debug,
          appId,
          timestamp,
          nonceStr,
          signature,
          // 必填，需要使用的JS接口列表
          jsApiList: ['updateAppMessageShareData', 'getLocation'],
          // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          openTagList: ['wx-open-launch-app'],
        })
        wx.error(() => {
          console.log('error')
          resolve(true)
        })

        wx.ready(() => {
          console.log('ready')
          resolve(true)
          callback?.()
        })
      }
    })
  })
}

/**
 * 微信自定义“分享给朋友”及“分享到QQ”按钮的分享内容
 */
export function wxUpdateAppMessageShareData(
  title = '宝贝启蒙必修课，超值拼团限时购！',
  desc = '开团后邀请好友拼团，团满即得！',
  imgUrl = getImageUrl('group_list_bgi'),
) {
  wx.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    imgUrl, // 分享图标
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    success: () => {
      console.log('设置成功')
    },
  })
}

/**
 * 分割以逗号分割的封面图
 * @param imgsStr
 * @param mode 模式 img返回单张 arr返回数组
 */
export function filterImgCover(imgsStr: string, mode = 'img') {
  try {
    if (mode === 'img') {
      return imgsStr.split(',')[0]
    } else {
      return imgsStr.split(',')
    }
  } catch (err) {
    console.log(err, 'filterImgCover')
    return imgsStr
  }
}
