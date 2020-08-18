/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:45:23
 * @LastEditors: わからないよう
 */
import Taro from '@tarojs/taro'
import { getCookie } from './cookie'

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
  var exp = new Date();
  exp.setTime(exp.getTime() + 3 * 24 * 60 * 60 * 1000);
  document.cookie = "Token=" + escape(Token) + ";expires=" + exp.toGMTString() + ';path=' + '/';
  return '设置成功'
}