window.addEventListener('load', async function () {
  form = layui.form
  form.verify({
    title: [/^[\S]{1,30}$/, '文章标题字数1-30位']
  })
  initEditor()
  // 发起ajax请求
  const select = document.querySelector('[name=cate_id]')
  const { data: res } = await axios.get('my/cate/list')
  if (res.code !== 0) return layer.msg(res.message)
  res.data.forEach(item => {
    let opt = new Option(`${item.cate_name}`, item.id)
    select.options.add(opt)
    layui.form.render('select')
  })
  // 设置裁剪区域
  const $img = $('#image')
  const options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  $img.cropper(options)
  // 触发上传图片事件
  document.querySelector('#btnChooseImage').addEventListener('click', function (e) {
    document.querySelector('#coverFile').click()
  })
  document.querySelector('#coverFile').addEventListener('change', function () {
    if (this.files.length <= 0) return
    const newImgURL = URL.createObjectURL(this.files[0])
    $img.cropper('destroy').attr('src', newImgURL).cropper(options)
  })
  // 文章的发布状态
  let art_state = '已发布'
  document.querySelector('#btnSave2').addEventListener('click', function () {
    art_state = '草稿'
  })
  document.querySelector('#form-pub').addEventListener('submit', function (e) {
    e.preventDefault()
    const fd = new FormData(this)
    fd.append('state', art_state)
    // 将裁剪过后的图片，输出为一个文件对象
    $img.cropper('getCroppedCanvas', { width: 400, height: 280 }).toBlob(function (blob) {
      fd.append('cover_img', blob)
      publishArticle(fd)
    })
  })
  // ajax请求
  async function publishArticle(fd) {
    if (!form.validate('#form-pub')) return
    const { data: res } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: fd,
      url: 'my/article/add'
    })
    if (res.code !== 0) return layer.msg(res.message)
    layer.msg(res.message)
    location.href = './art_list.html'
    window.parent.tabChange()
  }
})
