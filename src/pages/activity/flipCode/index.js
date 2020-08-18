/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:42:02
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton } from 'taro-ui'
import QRCode from 'qrcode';
import { setCookie } from '../../../utils/cookie'
import { hasUserState } from '../../../utils/login'

import './index.scss'

@connect(({ activity }) => ({
  ...activity
}))
export default class Index extends Component {
  constructor(props) {
      super(props)
  }
  state = {
    allCoupon: 0,
    couponInfo: {},
    qrcodeUrl: '',
    couponNum: '',
    showCoupon: false
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    const appInfo = localStorage.getItem('appInfo')
    const token = localStorage.getItem('Token')
    if (appInfo || token) {
      setCookie('Token', appInfo || token)
    }
    hasUserState().then(res => {
      res && this.initPage()
    })
  }

  initPage() {
    this.props.dispatch({
      type: 'activity/myCouponList',
      payload: {
        size: 10,
        page: 1,
        status: 3
      },
      callback: res => {
        this.setState({
          allCoupon: res.data.totalRecords
        })
      }
    })
  }
  getCoupon = () => {
    this.props.dispatch({
      type: 'activity/getCoupon',
      payload: {
        couponId: 1
      },
      callback: (res) => {
        if (res.code === 200) {
          QRCode.toDataURL(res.data, {margin: 1}).then(url => {
            this.setState({
              qrcodeUrl: url,
              couponNum: res.data,
              showCoupon: true
            })
          })
        }
      }
    })
  }
  closeCoupon = () => {
    this.setState({
      showCoupon: false
    })
  }
  toRecording = () => {
    Taro.navigateTo({
      url: '/pages/activity/flipCode/recording/index'
    })
  }

  componentDidHide () { }

  render () {
    const { couponInfo, showCoupon, qrcodeUrl, couponNum, allCoupon } = this.state
    return (
      <View className='flip-code-page'>
        {!showCoupon && (
        <View className='title-view'>
          <Image className='title-img' src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/activity/flipCode/title.png'></Image>
          <View className='tab-tip' onClick={this.toRecording}> recording</View>
        </View>
        )}
        {!showCoupon && (
        <View className='card-area'>
          <View className='card-title'>Issue coupons</View>
          <View>
            <AtButton className='issue-btn' onClick={this.getCoupon}>Issue</AtButton>
          </View>
          <View className='card-subtitle'>You have issued {allCoupon} sheets</View>
        </View>
        )}
        {showCoupon && (
        <View className='coupon-area'>
          <View className='coupon'>
            <Image className='coupon-img' src={qrcodeUrl}></Image>
            <View className='coupon-num' onClick={this.closeCoupon}>
              {couponNum}
            </View>
          </View>
        </View>
        )}
      </View>
    )
  }
}
