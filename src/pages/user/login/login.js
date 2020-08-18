import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtInput } from 'taro-ui'
import { setCookie } from '../../../utils/cookie';
import './index.scss'

@connect(({ user }) => ({
  ...user,
}))
export default class Login extends Component {
  state = {
    phoneOrEmail: '',
    password: '',
    code: '',
    sumitFlag: false, // 提交按钮置灰
    see: false, // 密码的可见与不可见
    sendMsg: '获取验证码', // 获取验证码文字 用于倒计时60秒 重新获取
    sendFlag: true,
    loginType: 1 // 1.账号密码登录 2.短信验证码登录
  }
  componentDidMount = () => {
    let phoneOrEmail = getCurrentInstance().router.params.phoneOrEmail
    this.setState({
      phoneOrEmail: phoneOrEmail || ''
    })
  };
  getPhone = (value) => {
    this.setState({
      phoneOrEmail: value
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
    const { phoneOrEmail } = this.state;
    if (phoneOrEmail == '') {
      Taro.showToast({
        title: '号码不能为空',
        icon: 'none'
      })
      return
    } 
    this.props.dispatch({
      type: "user/getCode",
      payload: { phoneOrEmail: this.state.phoneOrEmail, businessType: 'Login' },
      callback: (data) => {
        if ( data.code == 200 ) {
          this.timeFunction()
          Taro.showToast({
            title: '发送成功',
            icon: 'none'
          })
        }
      }
    })
  }
  // 计时器
  timeFunction = () => {
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
  }

  toRegister = () => {
    Taro.redirectTo({
      url: `/pages/user/login/register`
    })
  }
  toNewpwd = () => {
    Taro.navigateTo({
      url: '/pages/user/login/newpwd'
    })
  }
  // 改变按钮置灰状态
  changeSubmitFlag = () => {
    if (
      this.state.phoneOrEmail != '' && this.state.code != '' && this.state.loginType == 2 ||
      this.state.phoneOrEmail != '' && this.state.password != '' && this.state.loginType == 1
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
  // 改变登录方式
  chageLoginType = (loginType) => {
    this.setState({
      loginType: loginType == 1 ? 2 : 1
    }, this.changeSubmitFlag)
  }
  
  // 登录
  login = () => {
    let url = '';
    let _this = this;
    let params = {
      phoneOrEmail : this.state.phoneOrEmail,
      accountType: 'EMAIL'
    }
    if ( this.state.loginType == 1 ) {
      params.password = this.state.password
      url = 'user/login'
    } else {
      params.verification = this.state.code
      url = 'user/codeLogin'
    };
    this.props.dispatch({
      type: url,
      payload: params,
      callback: (data) => {
        if (data.code == 200) {
          Taro.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            _this.goBack()
          }, 1000)
          setCookie('Token', data.data)
        } else {
          
        }
      }
    })
  }

  weLogin() {
    console.log('微信登录')
  }
  aliLogin() {
    console.log('支付宝登录')
  }
  render() {
    const { sendMsg, see, phone, code, password, sumitFlag, sendFlag, loginType } = this.state
    return (
      <View className='login'>
        <View className='at-row at-row__justify--around at-row__align--center'>
          <View className='at-col-6' onClick={this.goBack}>
            <Image className='back-icon' src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/user/back.png' />
          </View>
          <View className='at-col-6 head-word' onClick={this.toRegister}>快速注册</View>
        </View>
        {/* 登录 */}
        <View className='login-word'>登录</View>
        <View className='login-form'>
          <AtInput
            clear
            name='phone'
            border={false}
            placeholder='请输入邮箱'
            onChange={this.getPhone}
            value={phone}
          >
            {loginType == 2 && sendFlag && <Text className='send-code' onClick={this.sendCode}>
              {sendMsg}
            </Text>}
            {loginType == 2 && !sendFlag && <Text className='send-code disable-send'>
              {sendMsg}
            </Text>}
          </AtInput>
          {loginType == 2 && <View className='code'>
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
          {loginType == 1 && <View className='password'>
            <AtInput
              clear
              name='password'
              border={false}
              title=''
              type={!see ? 'password' : 'text'}
              placeholder='请输入密码'
              onChange={this.getPassword}
              value={password}
            >
              {see &&
                <Image className='right-icon' onClick={this.seePassword} src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/user/see.png' />}
              {!see &&
                <Image className='right-icon' onClick={this.seePassword} src='https://usa-east-static.oss-us-east-1.aliyuncs.com/canada/prod/frontend/user/unseen.png' />}
            </AtInput>
          </View>}
          {sumitFlag && <View className='submit' >
            <AtButton type='primary' size='normal' onClick={this.login}>登录</AtButton>
          </View>}
          {!sumitFlag && <View className='no-submit' >
            <AtButton type='primary' size='normal'>登录</AtButton>
          </View>}
        </View>
        <View className='at-row loginprop'>
          <View className='at-col-6' onClick={(e) => {this.chageLoginType(loginType, e)}}>
            {/* {
              loginType == 1 ? '短信验证码登录' : '账号密码登录'
            } */}
            
          </View>
          <View className='at-col-6 head-word' onClick={this.toNewpwd}>忘记密码</View>
        </View>
      </View>
    )
  }
}