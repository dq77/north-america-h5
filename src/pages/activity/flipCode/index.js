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
import QRCode from 'qrcode';
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
    allCoupon: 0,
    qrcodeUrl: '',
    couponNum: '',
    showCoupon: false,
    loading: false,
    nickName: ''
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
        this.setState({ loading: true })
        this.props.dispatch({
          type: 'user/getUserInfo',
          payload: {},
          callback: (info) => {
            if (info.code !== 200) {
              this.setState({
                loading: false
              })
              return false
            }
            this.props.dispatch({
              type: 'activity/getCoupon',
              payload: { couponId: 1 },
              callback: (res) => {
                if (res.code === 200) {
                  QRCode.toDataURL(res.data, {margin: 1, width: 200}).then(url => {
                    this.setState({
                      qrcodeUrl: url,
                      couponNum: res.data.replace(/\s/g,'').replace(/(.{4})/g,"$1 "),
                      showCoupon: true,
                      nickName: info.data.nickName
                    })
                  })
                }
                this.setState({
                  loading: false
                })
              }
            })
          }
        })
      }
    })
  }
  closeCoupon = () => {
    this.setState({
      showCoupon: false
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
    const { showCoupon, qrcodeUrl, couponNum, allCoupon, loading, nickName } = this.state
    return (
      <View className='flip-code-page'>
        {!showCoupon && (
        <View className='title-view'>
          <Image className='title-img' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/activity/flipCode/title.png'></Image>
          <View className='tab-tip' onClick={this.toRecording}> recording</View>
        </View>
        )}
        {!showCoupon && (
        <View className='card-area'>
          <View className='card-title'>Issue coupons</View>
          <View>
            <AtButton disabled={loading} className='issue-btn' onClick={this.getCoupon}>Issue</AtButton>
          </View>
          <View className='card-subtitle'>You have issued {allCoupon} sheets</View>
        </View>
        )}
        {showCoupon && (
        <View className='coupon-area'>
          <View className='top-area'>
            <Image className='top-img' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/activity/flipCode/code-top.png'></Image>
          </View>
          <View className='coupon'>
            <Image className='coupon-img' onClick={this.closeCoupon} src={qrcodeUrl}></Image>
            <View className='coupon-num' onClick={this.closeCoupon}>
              {couponNum}
            </View>
            <View className='nick-name'>{nickName}</View>
          </View>
          <View className='btm-area'>
            住房神助攻 就找淘租公
          </View>
        </View>
        )}
      </View>
    )
  }
}
