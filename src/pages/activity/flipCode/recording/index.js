/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:42:02
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import { View, ScrollView, Image } from '@tarojs/components'
import { connect } from 'react-redux'

import './index.scss'

@connect(({ activity }) => ({
  ...activity
}))
export default class Index extends Component {
  constructor(props) {
      super(props)
  }
  state = {
    couponList: [],
    tab: 3,
    order: true,
    page: 1,
    totalPage: 1,
    totalRecords: 0

  }

  componentWillMount () { }

  componentDidMount () {
    this.getList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  getList() {
    this.props.dispatch({
      type: 'activity/myCouponList',
      payload: {
        size: 10,
        page: this.state.page,
        status: this.state.tab
      },
      callback: res => {
        this.setState({
          couponList: this.state.couponList.concat(res.data.list),
          totalPage: res.data.totalPage,
          totalRecords: res.data.totalRecords
        })
      }
    })
  }
  loadMore = () => {
    if (this.state.totalPage > this.state.page) {
      this.setState({
        page: this.state.page - -1
      }, () => {
        this.getList()
      })
    }
  }
  changeTab = (tab) => {
    this.setState({
      couponList: [],
      page: 1,
      tab: tab
    }, () => {
      this.getList()
    })
  }
  changeOrder = () => {
    this.setState({
      order: !this.state.order
    })
  }

  componentDidHide () { }

  render () {
    const { couponList, tab, order, totalRecords } = this.state
    return (
      <View className='code-recording-page'>
        <View className='title-view'>
          <View onClick={() => {this.changeTab(3)}} className={`title-item ${tab === 3}`}>Already issued</View>
          <View onClick={() => {this.changeTab(4)}} className={`title-item ${tab === 4}`}>already used</View>
        </View>
        <View className='list-head'>
          <View>数量：{totalRecords}</View>
          <View onClick={() => {this.changeOrder()}}>时间
            {order && (
            <Image className='right-tip' src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/activity/flipCode/sort-up.png'></Image>
            )}
            {!order && (
            <Image className='right-tip' src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/activity/flipCode/sort-desc.png'></Image>
            )}
          </View>
        </View>
        <ScrollView onScrollToLower={this.loadMore} className='list-area' scrollY scrollWithAnimation>
          { couponList.map(item => { return (
            <View key={item.code} className='item'>
              <View>{item.couponName}</View>
              <View className='btn-info'>
                <View>{item.code}</View>
                <View className='time'>{item.gmtCreate}</View>
              </View>
            </View>
          )})}
        </ScrollView>
      </View>
    )
  }
}
