/*
 * @Author: 刁琪
 * @Date: 2020-08-18 13:58:51
 * @LastEditors: わからないよう
 */

export default {
  namespace: 'common',
  state: {
    channel: ''
  },

  effects: {
    *setChannel({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          channel: payload
        }
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
