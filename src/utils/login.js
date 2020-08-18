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