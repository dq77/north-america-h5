/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:42:02
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton } from 'taro-ui'
import { getCookie } from '../../../utils/cookie'
import { hasUserState } from '../../../utils/login'

import './index.scss'

@connect(({ activity, common, user }) => ({
  ...activity, ...common, ...user
}))
export default class Index extends Component {
  constructor(props) {
      super(props)
  }
  state = {
    allCoupon: 0
  }

  componentWillMount () { }

  componentDidMount () {
    this.props.dispatch({
      type: 'common/setChannel',
      payload: process.env.CHANNEL
    })
  }

  componentWillUnmount () { }

  componentDidShow () {
    if (getCookie('Token')) {
      this.props.dispatch({
        type: 'common/setIsLogin',
        payload: true
      })
      this.initPage()
    }
  }

  initPage() {
    this.props.dispatch({
      type: 'activity/myCouponList',
      payload: {
        size: 10,
        page: 1
      },
      callback: res => {
        this.setState({
          allCoupon: res.data.totalRecords
        })
      }
    })
  }
  getCoupon = () => {
    hasUserState().then(isLogin => {
      if (isLogin) {
        Taro.navigateTo({
          url: '/pages/activity/flipCode/qrpage/index'
        })
      }
    })
  }
  toRecording = () => {
    hasUserState().then(isLogin => {
      if (isLogin) {
        Taro.navigateTo({
          url: '/pages/activity/flipCode/recording/index'
        })
      }
    })
  }

  componentDidHide () { }

  render () {
    const { allCoupon } = this.state
    return (
      <View className='flip-code-page'>
        <View className='title-view'>
          <Image className='title-img' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/activity/flipCode/title.png'></Image>
          <View className='tab-tip' onClick={this.toRecording}> recording</View>
        </View>
        <View className='card-area'>
          <View className='card-title'>Issue coupons</View>
          <View>
            <AtButton className='issue-btn' onClick={this.getCoupon}>Issue</AtButton>
          </View>
          <View className='card-subtitle'>You have issued {allCoupon} sheets</View>
        </View>
      </View>
    )
  }
}
