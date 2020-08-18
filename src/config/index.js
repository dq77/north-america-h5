/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:45:04
 * @LastEditors: わからないよう
 */

let url = ''
if (process.env.NODE_ENV === 'development') {

  // 本地调试环境 你愿意连谁就连谁 没人管你 (仅开发环境生效，测试或者生产环境的配置在/config/prod.js里选择)
  url = "http://canada.api.taozugong.cn" // 加拿大测试环境
  // url = "http://canada.api.taozugong.com" // 加拿大生产环境
  // url = "http://usa.api.taozugong.cn" // 美国测试环境
  // url = "http://usa.api.taozugong.com" // 美国生产环境

} else if (process.env.NODE_ENV === 'production') {
  url = `http://${process.env.CHANNEL}.${process.env.BUILD === 'test' ? 'api.taozugong.cn' : 'service.taozugong.com'}`
}

export const baseUrl = url