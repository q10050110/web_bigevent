// 设置请求根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net/'
// 请求拦截器添加token请求头保证用户有权限获取数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 获取元素
const oldPwd = document.querySelector('[name=oldPwd]')
const newPwd = document.querySelector('[name=newPwd]')
// 表单验证
const form = layui.form
form.verify({
  pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
  samePwd(value) {
    if (value === oldPwd.value) return '新旧密码不能相同！'
  },
  rePwd(value) {
    if (value !== newPwd) return '两次密码不一致！'
  }
})
// 用户密码
const password = {
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
}
document.querySelector('[name=oldPwd]').addEventListener('input', function () {
  password.old_pwd = this.value
})
document.querySelector('[name=newPwd]').addEventListener('input', function () {
  password.new_pwd = this.value
})
document.querySelector('[name=rePwd]').addEventListener('input', function () {
  password.re_pwd = this.value
})
// 修改密码
document.querySelector('.layui-form').addEventListener('click', async function (e) {
  e.preventDefault()
  if (e.target.type === 'submit') {
    const { data: res } = await axios.patch('my/updatepwd', password)
    if (res.code !== 0) return layui.layer.msg('更新密码失败！')
    layui.layer.msg('更新密码成功！')
    this.reset()
  }
})
