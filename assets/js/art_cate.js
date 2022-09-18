window.addEventListener('load', function () {
  // 表单验证
  const form = layui.form
  // 获取元素
  const tb = this.document.querySelector('tbody')
  let cateList = []
  // 发起ajax请求
  async function initArtCateList() {
    const { data: res } = await axios.get('my/cate/list')
    if (res.code !== 0) return layer.msg(res.message)
    cateList = res.data
    tb.innerHTML = cateList
      .map(
        item =>
          `<tr><td>${item.id}</td><td>${item.cate_name}</td><td>${item.cate_alias}</td><td><button type="button" class="layui-btn layui-btn-xs btn-edit" data-id="${item.id}">编辑</button><button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete"  data-id="${item.id}">删除</button></td></tr>`
      )
      .join('')
  }
  initArtCateList()
  // 显示添加文章分类文本框
  const layer = layui.layer
  let index = null
  const addCate = document.querySelector('#btnAddCate')
  addCate.addEventListener('click', function () {
    index = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: document.querySelector('#dialog-add').innerHTML
    })
  })
  // 添加文章分类
  document.querySelector('body').addEventListener('click', async function (e) {
    e.preventDefault()
    if (e.target.classList.contains('addCate')) {
      const cateInfo = {
        cate_name: document.querySelector('#form-add [name=name]').value,
        cate_alias: document.querySelector('#form-add [name=alias]').value
      }
      if (!form.validate(document.querySelector('#form-add'))) return
      const { data: res } = await axios.post('my/cate/add', cateInfo)
      if (res.code !== 0) return layer.msg(res.message)
      layer.msg('新增分类成功！')
      initArtCateList()
      layer.close(index)
    }
  })
  document.querySelector('body').addEventListener('click', async function (e) {
    if (e.target.type === 'reset') document.querySelector('#form-add').reset()
  })
  // 显示修改文章分类对话框
  let edit = null
  let id = null
  document.querySelector('.layui-card-body').addEventListener('click', async function (e) {
    e.preventDefault()
    if (e.target.classList.contains('btn-edit')) {
      id = e.target.dataset.id
      const { data: res } = await axios.get('my/cate/info?id=' + id)
      if (res.code !== 0) return layer.msg('获取分类数据失败！')
      edit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: document.querySelector('#dialog-edit').innerHTML
      })
      document.querySelector('[name=name]').value = res.data.cate_name
      document.querySelector('[name=alias]').value = res.data.cate_alias
    }
  })
  // 修改文章分类
  this.document.querySelector('body').addEventListener('click', async function (e) {
    e.preventDefault()
    if (e.target.classList.contains('changeCate')) {
      const cateInfo = {
        id: id,
        cate_name: document.querySelector('[name=name]').value,
        cate_alias: document.querySelector('[name=alias]').value
      }
      if (!form.validate(document.querySelector('#form-edit'))) return
      const { data: res } = await axios.put('my/cate/info', cateInfo)
      if (res.code !== 0) return layer.msg(res.message)
      layer.msg('修改分类成功！')
      initArtCateList()
      layer.close(edit)
    }
  })
  // 删除文章分类
  document.querySelector('.layui-card-body').addEventListener('click', function (e) {
    e.preventDefault()
    if (e.target.classList.contains('btn-delete')) {
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, async function (index) {
        const { data: res } = await axios.delete('my/cate/del?id=' + e.target.dataset.id)
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg('删除分类成功！')
        initArtCateList()
      })
    }
  })
})
