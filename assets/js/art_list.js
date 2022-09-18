window.addEventListener('load', function () {
  // 设置请求页数，条数
  const atrInfo = {
    pagenum: 1,
    pagesize: 10,
    cate_id: '',
    state: ''
  }
  // 获取文章列表
  async function initList(atrInfo) {
    const { data: res } = await axios.get('my/article/list', { params: atrInfo })
    if (res.code !== 0) return layer.msg(res.message)
    res.data.forEach(item => (item.pub_date = dateFilter(item.pub_date)))
    ranDar(res)
  }
  initList(atrInfo)
  // 获取分类列表
  async function getCateList() {
    const { data: res } = await axios.get('my/cate/list')
    if (res.code !== 0) return layer.msg('获取数据失败')
    const select = document.querySelector('[name=cate_id]')
    res.data.forEach(item => select.append(new Option(`${item.cate_name}`, item.id)))
    layui.form.render('select')
  }
  getCateList()
  // 渲染页面
  function ranDar(list) {
    document.querySelector('tbody').innerHTML = list.data
      .map(
        item =>
          `<tr><td>${item.title}</td><td>${item.cate_name}</td><td>${item.pub_date}</td><td>${item.state}</td><td><button type="button" class="layui-btn layui-btn-sm change" data-id="${item.id}">修改</button><button type="button" class="layui-btn layui-btn-danger layui-btn-sm del" data-id="${item.id}">删除</button></td></tr>`
      )
      .join('')
    getTotal(list.total)
  }
  // 筛选文章
  document.querySelector('#form-search').addEventListener('submit', function (e) {
    e.preventDefault()
    if ((e.target.type = 'submit')) {
      const id = document.querySelector('[name=cate_id]')
      const index = id.selectedIndex
      const state = document.querySelector('[name=state]')
      const stateIndex = state.selectedIndex
      atrInfo.cate_id = id.options[index].value
      atrInfo.state = state.options[stateIndex].value
      initList(atrInfo)
    }
  })
  //  分页器
  function getTotal(total) {
    const laypage = layui.laypage
    laypage.render({
      elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: atrInfo.pagesize,
      curr: atrInfo.pagenum,
      limits: [5, 10, 20, 40],
      layout: ['prev', 'limit', 'page', 'skip', 'next'],
      jump(obj, first) {
        atrInfo.pagenum = obj.curr
        atrInfo.pagesize = obj.limit
        if (!first) {
          initList(atrInfo)
        }
      }
    })
  }

  // 删除文章
  document.querySelector('tbody').addEventListener('click', function (e) {
    if (e.target.classList.contains('del')) {
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, async function (index) {
        console.log(index)
        const { data: res } = await axios.delete('my/article/info?id=' + e.target.dataset.id)
        if (res.code !== 0) return layer.msg(res.message)
        initList(atrInfo)
        layer.msg(res.message)
        layer.close(index)
      })
    }
  })
  // 时间过滤器
  function dateFilter(date) {
    const dt = new Date(date)
    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 补0函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
})
