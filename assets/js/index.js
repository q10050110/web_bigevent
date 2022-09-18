// 页面加载完成后发起ajax请求
async function getUserInfo() {
  const Authorization = sessionStorage.getItem('token')
  if (!Authorization) return (this.location.href = './login.html')
  const { data: res } = await axios.get('my/userinfo')
  if (res.code !== 0) return layui.layer.msg('获取用户信息失败！')
  renderAvatar(res.data)
}
getUserInfo()
// 渲染用户头像
function renderAvatar(user) {
  const imgs = document.querySelectorAll('.layui-nav-img')
  const txts = document.querySelectorAll('.text-avatar')
  const name = user.nickname || user.username
  document.querySelector('#welcome').innerHTML = `欢迎${name}`
  if (user.user_pic !== null) {
    imgs.forEach(item => (item.src = user.user_pic))
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

// tab栏切换
function tabChange() {
  document.querySelector('.fb').classList.remove('layui-this')
  document.querySelector('.list').classList.add('layui-this')
}
