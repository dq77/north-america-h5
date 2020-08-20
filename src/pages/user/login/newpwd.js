import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import md5 from 'md5'
import { View, Image, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtInput } from 'taro-ui'
import './index.scss'

@connect(({ user }) => ({
  ...user,
}))
export default class Newpwd extends Component {
  state = {
    phone: '',
    password: '',
    code: '',
    sumitFlag: false, // 提交按钮置灰
    see: false, // 密码的可见与不可见
    sendMsg: '获取验证码', // 获取验证码文字 用于倒计时60秒 重新获取
    sendFlag: true,
    isConfirm: false // 核实身份，允许设置新密码
  }
  componentDidMount = () => {

  };
  getPhone = (value) => {
    this.setState({
      phone: value
    }, this.changeSubmitFlag)
  }
  goBack = () => {
    Taro.navigateBack();
  }
  //  密码的显示与隐藏
  seePassword = () => {
    this.setState({
      see: !this.state.see
    })
  }
  //  获取密码
  getPassword = (value) => {
    this.setState({
      password: value
    }, this.changeSubmitFlag)
  }
  getCode = (value) => {
    this.setState({
      code: value
    }, this.changeSubmitFlag)
  }
  // 获取验证码
  sendCode = () => {
    const { phone } = this.state;
    if (phone == '') {
      Taro.showToast({
        title: '邮箱不能为空',
        icon: 'none'
      })
    } else {
      let num = 60
      let timer = null
      timer = setInterval(() => {
        num = num - 1
        if (num == 0) {
          clearInterval(timer);
          this.setState({
            sendFlag: true,
            sendMsg: '重新发送'
          })
        } else {
          this.setState({
            sendFlag: false,
            sendMsg: '重新发送' + num + '秒'
          })
        }
      }, 1000)
      this.props.dispatch({
          type: "user/getCode",
          payload: { mobile: this.state.phone, businessType: 'EditPwd' },
          callback: (data) => {
            if ( data.code == 200 ) {
              Taro.showToast({
                title: '发送成功',
                icon: 'none'
              })
            }
          }
        }
      )
    }
  }

  // 改变按钮置灰状态
  changeSubmitFlag = () => {
    if (
      this.state.phone != '' && this.state.code != '' && !this.state.isConfirm ||
      this.state.password != '' && this.state.isConfirm
      ) {
      this.setState({
        sumitFlag: true
      })
    } else {
      this.setState({
        sumitFlag: false
      })
    }
  }
  confirmCode = () => {
    this.setState({
      isConfirm: true
    })
  }
  // 提交新密码
  setPass = () => {
    let _this = this
    this.props.dispatch({
      type: 'user/findPassword',
      payload: {
        phoneOrEmail: this.state.phone,
        password: md5(this.state.password),
        accountType: 'EMAIL',
        captcha: this.state.code
      },
      callback: (data) => {
        console.log(data)
        if (data.code == 200) {
          Taro.showToast({
            title: '密码设置成功',
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            _this.goBack()
          }, 1000)
        } else if (data.code == 40005)  {
          this.setState({
            isConfirm: false
          })
        }
      }
    })
  }

  render() {
    const { sendMsg, see, phone, code, password, sumitFlag, sendFlag, isConfirm } = this.state
    return (
      <View className='login'>
        <View className='at-row at-row__justify--around at-row__align--left'>
          <View className='at-col-6' onClick={this.goBack}>
            <Image className='back-icon' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/back.png' />
          </View>
          <View className='at-col-6 head-word'></View>
        </View>
        {/* 找回密码 */}
        <View className='login-word'>
          { isConfirm ? '设置新密码' : '找回密码' }
        </View>
        <View className='login-form'>
          { !isConfirm &&
          <AtInput
            clear
            name='phone'
            border={false}
            placeholder='请输入邮箱'
            onChange={this.getPhone}
            value={phone}
          >
            {sendFlag && <Text className='send-code' onClick={this.sendCode}>
              {sendMsg}
            </Text>}
            {!sendFlag && <Text className='send-code disable-send'>
              {sendMsg}
            </Text>}
          </AtInput>}
          { !isConfirm &&
          <View className='code'>
            <AtInput
              clear
              title=''
              type='text'
              maxLength='4'
              placeholder='验证码'
              value={code}
              onChange={this.getCode}
            >
            </AtInput>
          </View>}
          { isConfirm &&
          <View className='password'>
            <AtInput
              clear
              name='password'
              border={false}
              title=''
              type={!see ? 'password' : 'text'}
              placeholder='请输入新密码'
              onChange={this.getPassword}
              value={password}
            >
              {see &&
                <Image className='right-icon' onClick={this.seePassword} src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/see.png' />}
              {!see &&
                <Image className='right-icon' onClick={this.seePassword} src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/unseen.png' />}
            </AtInput>
          </View>}
          {sumitFlag && <View className='submit' >
            <AtButton type='primary' size='normal' onClick={
              isConfirm ? ()=>{ this.setPass() } : ()=>{ this.confirmCode()}
            }
            >
              {isConfirm ? '提交' : '找回密码'}
            </AtButton>
          </View>}
          {!sumitFlag && <View className='no-submit' >
            <AtButton type='primary' size='normal'>
              {isConfirm ? '提交' : '找回密码'}
            </AtButton>
          </View>}
        </View>
      </View>
    )
  }
}