// 设置请求根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net/'
// 请求拦截器添加token请求头保证用户有权限获取数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 页面加载完成后发起ajax请求
window.addEventListener('load', async function () {
  const Authorization = sessionStorage.getItem('token')
  if (!Authorization) return (this.location.href = './login.html')
  const { data: res } = await axios.get('my/userinfo')
  if (res.code !== 0) return layui.layer.msg('获取用户信息失败！')
  renderAvatar(res.data)
})

// 渲染用户头像
function renderAvatar(user) {
  const imgs = document.querySelectorAll('.layui-nav-img')
  const txts = document.querySelectorAll('.text-avatar')
  const name = user.nickname || user.username
  document.querySelector('#welcome').innerHTML = `欢迎${name}`
  if (user.user_pic !== null) {
    imgs.forEach(item => {
      item.style.src = user.user_pic
      item.style.display = 'inline-block'
    })
    txts.forEach(item => (item.style.display = 'none'))
  } else {
    txts.forEach(item => {
      item.innerHTML = name[0].toUpperCase()
      item.style.display = 'inline-block'
    })
    imgs.forEach(item => (item.style.display = 'none'))
  }
}

// 退出功能
document.querySelector('#btnLogout').addEventListener('click', function () {
  layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
    sessionStorage.removeItem('token')
    layer.close(index)
    location.href = './login.html'
  })
})
