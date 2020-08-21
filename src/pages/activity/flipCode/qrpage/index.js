/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:42:02
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import QRCode from 'qrcode';

import './index.scss'

@connect(({ activity, common, user }) => ({
  ...activity, ...common, ...user
}))
export default class Index extends Component {
  constructor(props) {
      super(props)
  }
  state = {
    qrcodeUrl: '',
    couponNum: '',
    nickName: '',
    loading: true,
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.props.dispatch({
      type: 'user/getUserInfo',
      payload: {},
      callback: (info) => {
        if (info.code === 200) {
          this.setState({
            nickName: info.data.nickName
          })
        }
      }
    })
    this.getCoupon()
  }
  getCoupon = () => {
    this.props.dispatch({
      type: 'activity/getCoupon',
      payload: { couponId: 1 },
      callback: (res) => {
        if (res.code === 200) {
          QRCode.toDataURL(res.data, {margin: 1, width: 200}).then(url => {
            this.setState({
              qrcodeUrl: url,
              couponNum: res.data.replace(/\s/g,'').replace(/(.{4})/g,"$1 "),
              loading: false
            })
          })
        }
      }
    })
  }

  componentDidHide () { }

  render () {
    const { qrcodeUrl, couponNum, nickName, loading } = this.state
    return (
      <View className='flip-code-page'>
        <View className='coupon-area'>
          <View className='top-area'>
            <Image className='top-img' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/activity/flipCode/code-top.png'></Image>
          </View>
          <View className='coupon'>
            <Image className='coupon-img' src={qrcodeUrl}></Image>
            <View className='coupon-num'>
              {couponNum}
            </View>
            {!loading && (<View className='nick-name'>{nickName}</View>)}
          </View>
          <View className='btm-area'>
            住房神助攻 就找淘租公
          </View>
        </View>
      </View>
    )
  }
}
