let wechat = {
  wxLogin: {
    uri: 'user/login'
  },
  wxPhone: {
    uri: 'phone_mp'
  },
  getFormId: {
    uri: 'user/formlog'
  }
}

let share = {
  getShare: {
    uri: 'shareinflow'
  }
}

const apis = {
  wechat,
  share
}

export default apis
