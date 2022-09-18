// 设置根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net/'
// 请求拦截器添加token请求头保证用户有权限获取数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token') || ''
  return config
})
// 响应拦截器判断token是否过期
axios.interceptors.response.use(config => {
  if (config.data.message === '身份认证失败！') {
    sessionStorage.removeItem('token')
    location.hash = './index.html'
  }
  return config
})
if (!location.pathname === '/%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html') {
  const token = sessionStorage.getItem('token')
  if (token) location.href = './index.html'
}
