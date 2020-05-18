let router = new HashRouter()
let container = document.getElementById('container')
new Promise((resolve) => {
  var xhr = new XMLHttpRequest();
  xhr.open('get', '.' + '/articles.json', true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      resolve(xhr.responseText)
    }
  }
  xhr.send(null)
})
  .then(res => {
    let data = JSON.parse(res)
    let length = data.length
    let token = ''
    for (let i = 0; i < length; i++) {
      const obj = data[i]
      const time = obj.time,
        comments = obj.comments,
        title = obj.title,
        hot = obj.hot,
        excerpt = obj.excerpt,
        url = obj.url,
        square = obj.square,
        author = obj.author,
        img = obj.img

      //注册页面
      router.register(url, () => {
        container.innerHTML = ''
        let div = document.createElement('div')
        div.id = 'markdown'
        container.appendChild(div)
        mdreader(`.${url}.md`).then(res => {
          Venus(res, "markdown");
        });
      })
      //首页
      token += `<div class='news-info clearfix' href="#">
          <div class='news-info-article' style='position: relative;'>
            <div class='news-info-meta' style='position: absolute;top: -18px;'>
              <span class='news-square'>${square}</span>
              <span class='news-time'>${time}</span>
            </div>
            <a class='news-info-title' href="#${url}">${title}</a>
            <div class='news-excerpt'>${excerpt}</div>
            <div class='news-info-meta'>
              <span class='news-author'>${author}</span>
              <span class='news-hot'>${hot}</span>
              <span class='news-comment'>${comments}</span>
            </div>
           </div>
          <div class='news-info-img'>
            <img src="${img}" alt="">
          </div>
        </div>`
    }
    //注册首页
    router.registerIndex(() => {
      container.innerHTML = token
    })
    //404
    router.registerNotFound(() => {
      container.innerHTML = '页面未找到'
    })
    //异常处理
    router.registerError((e) => {
      container.innerHTML = '页面异常，错误消息：<br>' + e.message
    })

    router.load()
  })







