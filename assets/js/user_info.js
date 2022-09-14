// 设置请求根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net/'
// 请求拦截器添加token请求头保证用户有权限获取数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
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
  const Authorization = sessionStorage.getItem('token')
  if (!Authorization) return (this.location.href = './login.html')
  const { data: res } = await axios.get('my/userinfo')
  if (res.code !== 0) return layui.layer.msg('获取用户信息失败！')
  form.val('formUserInfo', res.data)
  userInfo.id = res.data.id
  userInfo.nickname = res.data.nickname
  userInfo.email = res.data.email
}
// 页面加载完成后发起ajax请求
window.addEventListener('load', () => getUserInfo())
// 重置表单信息
document.querySelector('.btnReset').addEventListener('click', function (e) {
  e.preventDefault()
  getUserInfo()
})

// 更改用户信息
document.querySelector('.layui-form').addEventListener('click', async function (e) {
  e.preventDefault()
  if (e.target.type === 'submit') {
    const { data: res } = await axios.put('my/userinfo', userInfo)
    if (res.code !== 0) return layer.msg('更新用户信息失败！')
    layer.msg('更新用户信息成功！')
    window.parent.getUserInfo() //调用父级页面的方法
  }
})
