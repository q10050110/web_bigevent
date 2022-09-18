// 获取元素
const $img = $('#image')
const chooseImg = document.querySelector('.btnChooseImage')
// 配置裁剪区域 纵横比
const options = {
  aspectRatio: 1,
  preview: '.img-preview'
}
$img.cropper(options)
//弹出上传文件框
chooseImg.addEventListener('click', function () {
  document.querySelector('#file').click()
})
// 裁剪图片
$('#file').on('change', function (e) {
  const filelist = e.target.files
  if (filelist.length <= 0) return layer.msg('请选择照片！')
  const file = e.target.files[0]
  const imgURL = URL.createObjectURL(file)
  $img.cropper('destroy').attr('src', imgURL).cropper(options)
})

// 上传图片
$('.layui-btn-danger').on('click', async function () {
  // 将图片转换成base64格式的字符串
  const dataURL = $img
    .cropper('getCroppedCanvas', {
      width: 100,
      height: 100
    })
    .toDataURL('image/png')
  const { data: res } = await axios.patch('my/update/avatar', { avatar: dataURL })
  if (res.code !== 0) return layer.msg('更换头像失败！')
  window.parent.getUserInfo()
  layer.msg('更换头像成功！')
})
