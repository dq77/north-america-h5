/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:45:04
 * @LastEditors: わからないよう
 */


// export const baseUrl = "http://47.252.81.77"; // 测试接口地址
export const baseUrl = "http://canada.api.taozugong.cn";
// export const baseUrl = "https://service.taozugong.com"; // 正式接口地址
// export const serviecUrl = "https://jd.taozugong.cn"; // 京东测试地址
// export const serviecUrl = "https://canada.api.taozugong.cn"; // M站测试地址
// export const serviecUrl = "https://alipay.taozugong.cn"; // 生活号测试地址
export const serviecUrl = "https://jd.taozugong.com"; // 京东正式地址
// export const serviecUrl = "https://m.taozugong.com"; // M站正式地址
// export const serviecUrl = "https://alipay.taozugong.com"; // 生活号正式地址

export const alipayLifeAuthorizationUrl =
  "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017091208699638&scope=auth_user"; // 支付宝授权页面正式地址
// "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017082808426743&scope=auth_user"; // 支付宝授权页面测试地址

export const jdAuthorizationUrl =
  "http://opencredit.jd.com/oauth2/bind?merchantCode=73024369"; // 京东权益授权页面地址
export const imgUploadUrl = baseUrl;

//OSS CDN 图片地址
export const CDNUrl = "https://assets.taozugong.com";
