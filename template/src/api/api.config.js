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

let user = {
  userCenter: {
    uri: 'user/user_center'
  }
}

const apis = {
  wechat,
  share,
  user
}

export default apis
