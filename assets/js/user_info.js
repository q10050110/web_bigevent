window.addEventListener('load', function () {
  // 表单验证
  const form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length > 6 || value.length < 1) return '昵称长度必须在 1 ~ 6 个字符之间！'
    }
  })
  // 修改的用户信息
  const userInfo = {
    id: '',
    nickname: '',
    email: ''
  }
  document.querySelector('[name="nickname"]').addEventListener('input', function () {
    userInfo.nickname = this.value
  })
  document.querySelector('[name="email"]').addEventListener('input', function () {
    userInfo.email = this.value
  })
  // 获取用户信息
  async function getUserInfo() {
    const { data: res } = await axios.get('my/userinfo')
    if (res.code !== 0) return layui.layer.msg('获取用户信息失败！')
    form.val('formUserInfo', res.data)
    userInfo.id = res.data.id
  }
  getUserInfo()
  // 重置表单信息
  document.querySelector('.btnReset').addEventListener('click', function (e) {
    e.preventDefault()
    getUserInfo()
  })

  // 更改用户信息
  document.querySelector('.layui-form').addEventListener('click', async function (e) {
    e.preventDefault()
    if (e.target.type === 'submit') {
      if (!form.validate(this)) return
      const { data: res } = await axios.put('my/userinfo', userInfo)
      if (res.code !== 0) return layer.msg('更新用户信息失败！')
      layer.msg('更新用户信息成功！')
      window.parent.getUserInfo() //调用父级页面的方法
    }
  })
})
