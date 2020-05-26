let file
let select_image = document.getElementById('select-image')
select_image.addEventListener("change", handleFile, false)
function handleFile() {
  file = this.files[0]
  console.log(file)

  let img = document.getElementById('pre-cover')
  img.src = window.URL.createObjectURL(file)
}
function selectImage() {
  select_image.click()
}
function saveData() {
  let id = /id=(.+)/.exec(location.href)[1]
  let title = document.getElementById('title').value
  let author = document.getElementById('author').value
  let square = document.getElementById('square').value
  let excerpt = document.getElementById('excerpt').value
  let markdown = document.getElementById('markdown').value
  if (title && author && square && excerpt && markdown) {
    let form_data = new FormData()
    form_data.append('id', id)
    form_data.append("title", title)
    form_data.append('author', author)
    form_data.append('square', square)
    form_data.append('excerpt', excerpt)
    if (file) {
      form_data.append('cover_img', file, file.name)
    }

    form_data.append('markdown', markdown)
    Wave('post', `${api_url}/v1/post/update`, form_data)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    alert('请将信息填写完整!')
  }
}