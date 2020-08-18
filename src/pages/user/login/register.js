import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtCheckbox, AtInput } from 'taro-ui'
import './index.scss'
import { setCookie } from '../../../utils/cookie'

@connect(({ user }) => ({
  ...user,
}))
export default class Register extends Component {

  constructor() {
    super(...arguments)
  }
  state = {
    phone: '',
    password: '',
    code: '',
    sumitFlag: false, // 提交按钮置灰
    see: false, // 密码的可见与不可见
    sendMsg: '获取验证码', // 获取验证码文字 用于倒计时60秒 重新获取
    sendFlag: true
  }
  componentDidMount = () => {
    let phone = getCurrentInstance().router.params.phone
    this.setState({
      phone: phone || ''
    })
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
    }else {
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
        payload: { mobile: this.state.phone, businessType: 'Register' },
        callback: (data) => {
          
          if ( data.code == 200 ) {
            Taro.showToast({
              title: '发送成功',
              icon: 'none'
            })
          }else if (data.code === 10006) {
            setTimeout(() => {
              this.toLogin(phone)
            }, 2000)
          }
        }
      })
    }
  }

  toLogin = (phone = null) => {
    Taro.redirectTo({
      url: `/pages/user/login/login?phone=${phone}`
    })
  }

  // 改变按钮置灰状态
  changeSubmitFlag = () => {
    if (this.state.phone != '' && this.state.code != '' && this.state.password != '') {
      this.setState({
        sumitFlag: true
      })
    } else {
      this.setState({
        sumitFlag: false
      })
    }
  }
  
  // 注册
  register = () => {
    let params = {
      phoneOrEmail: this.state.phone,
      password: this.state.password,
      captcha:this.state.code,
      accountType: 'EMAIL',
      channel:'TAO_ZU_GONG'
    }
    this.props.dispatch({
      type: "user/register",
      payload: params,
      callback: (data) => {
        if (data.code == 200) {
          Taro.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          }).then(() => {
            setCookie('Token', data.data)
            Taro.navigateTo({
              url: `/pages/user/login/login`,
            });
          })
        } else {
          Taro.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          }).then(
            // this.props.getType('account')
          )
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
    const { sendMsg, see, phone, code, password, sumitFlag, sendFlag } = this.state
    return (
      <View className='login'>
        <View className='at-row at-row__justify--around at-row__align--center'>
          <View className='at-col-6' onClick={this.goBack}>
            <Image className='back-icon' src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/back.png' />
          </View>
          <View className='at-col-6 head-word' onClick={this.toLogin}>账户登录</View>
        </View>
        {/* 注册 */}
        <View className='login-word'>快速注册</View>
        <View className='login-form'>
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

          </AtInput>
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
          </View>
          <View className='password'>
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
                <Image className='right-icon' onClick={this.seePassword} src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/see.png' />}
              {!see &&
                <Image className='right-icon' onClick={this.seePassword} src='https://north-america-h5.oss-us-east-1.aliyuncs.com/static/user/unseen.png' />}
            </AtInput>
          </View>
          {sumitFlag && <View className='submit' >
            <AtButton type='primary' size='normal' onClick={this.register}>注册</AtButton>
          </View>}
          {!sumitFlag && <View className='no-submit' >
            <AtButton type='primary' size='normal'>注册</AtButton>
          </View>}
        </View>
      </View>
    )
  }
}