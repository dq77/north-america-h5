/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:45:23
 * @LastEditors: わからないよう
 */
import Taro from '@tarojs/taro'
import { getCookie, setCookie } from './cookie'

export function hasUserState() {
  // 邮箱登录
  return new Promise((resolve) => {
    const token = getCookie('Token')
    if (token) {
      resolve(true);
    } else {
      Taro.navigateTo({
        url: `/pages/user/login/login`,
      });
      resolve(false);
    }
  });
}

// APP端Flutter推送Token至H5
window.flutterCallJsSetToken = function (Token) {
  // if (navigator.userAgent.includes('TZGCanadaApp')) {
  //   // 加拿大APP内嵌页面单独操作区
  //   console.log('This is Canada');
  // } else if (navigator.userAgent.includes('TZGUsaApp')) {
  //   // 美国APP内嵌页面单独操作区
  //   console.log('This is America');
  // }
  setCookie('Token', Token)
  return 'programme Set Token Complete'
}