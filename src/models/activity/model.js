/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:43:06
 * @LastEditors: わからないよう
 */
import * as activityApi from './service';

export default {
  namespace: 'activity',
  state: {
    couponList: []
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(activityApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },

    // 获取所有优惠券
    * couponList({payload,callback},{call,put}) {
      console.log('获取所有的优惠券');
      const { code, data} = yield call(activityApi.couponList, { ...payload })
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            couponList: data
          }
        })
        callback && callback(data)
      }
    },

    //  发放优惠券码
    * getCoupon({payload, callback}, {call, put}) {
      const data = yield call(activityApi.getCoupon, { ...payload })
      callback && callback(data)
    },
  
    // 查询我发放的券码
    * myCouponList({payload, callback}, {call, put}) {
      const data = yield call(activityApi.getMyCouponList, { ...payload })
      callback && callback(data)
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
