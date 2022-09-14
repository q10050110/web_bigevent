// 设置默认请求根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net/'
// 切换注册登录模块
const links = document.querySelector('.links')
const reg = document.querySelector('.reg-box')
const login = document.querySelector('.login-box')
const linkReg = document.querySelector('#link_reg1')
links.addEventListener('click', function () {
  reg.style.display = 'block'
  login.style.display = 'none'
})
linkReg.addEventListener('click', function () {
  reg.style.display = 'none'
  login.style.display = 'block'
})
// 表单验证，判断两次输入的密码是否一致！
const form = layui.form
form.verify({
  pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
  repwd(value) {
    const pwd = document.querySelector('.reg-box [name=password]').value
    if (pwd !== value) return '两次密码不一致'
  }
})
// 登录模块
const register = document.querySelector('.dl')
register.addEventListener('click', async function (e) {
  e.preventDefault()
  const userInfo = {
    username: document.querySelector('.login-box [name=username]').value,
    password: document.querySelector('.login-box [name=password]').value
  }
  if (e.target.tagName === 'BUTTON') {
    const { data: res } = await axios.post('api/login', userInfo)
    if (res.code !== 0) return layer.msg(res.message)
    layer.msg('登录成功！')
    sessionStorage.setItem('token', res.token)
    location.href = './index.html'
  }
})
// 注册模块
const zc = document.querySelector('.zc')
zc.addEventListener('click', async function (e) {
  e.preventDefault()
  const userInfo = {
    username: document.querySelector('.reg-box [name=username]').value,
    password: document.querySelector('.reg-box [name=password]').value,
    repassword: document.querySelector('.reg-box [name=reppassword]').value
  }
  if (e.target.tagName === 'BUTTON') {
    const { data: res } = await axios.post('api/reg', userInfo)
    if (res.code !== 0) return layer.msg(res.message)
    layer.msg('注册成功！')
    reg.style.display = 'none'
    login.style.display = 'block'
  }
})
