let api_url = config.api_url;
let _article = config.article;
let data
const container = document.getElementById("container");
let router = new HashRouter();
router.registerIndex(() => {
  container.innerHTML = "这里是首页";
});

router.registerNotFound(() => {
  container.innerHTML = "页面未找到";
});
router.registerError((e) => {
  container.innerHTML = "页面异常，错误消息：<br>" + e.message;
});
//文章编辑器页面注册
router.register("/articles/editor", () => {
  container.innerHTML = `<div>标题<input></div>`;
});
Wave("get", _article)
  .then((res) => {

    data = JSON.parse(res);
    let length = data.length;
    let token = `<table>
  <caption>文章列表</caption>
   <tr>
    <th>标题</th>
    <th>分类</th>
    <th>发布时间</th>
    <th>操作</th>
  </tr>`;
    for (let i = 0; i < length; i++) {
      const obj = data[i];
      const time = obj.time,
        title = obj.title,
        id = obj.id,
        url = obj.url,
        square = obj.square,
        author = obj.square,
        img = obj.img;
      token += `<tr>
    <td><span>${title}</span></td>
    <td>${square}</td>
    <td>${time}</td>
    <td >
      <button class='edit' data-id="${id}" onclick='button_edit(this)'>编辑</button>
      <button class='delete'>删除</button>
    </td>
  </tr>`;
    }
    token += `</table>`;
    router.register("/articles", () => {
      container.innerHTML = token;
    });
    router.load();
  });

function button_edit(e) {
  // Wave("get", api_url + "/article")
  //   .then((res) => {
  let _data = []
  data.forEach(item => {
    _data[item.id] = item
  });
  let currentData = _data[e.dataset.id]
  let url = currentData.url;
  let uuid = currentData.id;
  let title = currentData.title;
  let author = currentData.author;
  let square = currentData.square;
  let img = currentData.img;

  Wave('get', url)
    .then(res => {
      let mdData = res
      router.register(`/articles/editor?id=${uuid}`, () => {
        container.innerHTML =
          `<div class='editor-container'>
          <input id="select-image" type="file" accept="image/*">
          <div class='editor-cover' onclick="selectImage()">
            <img id="pre-cover" src="${img}" width="400px" height="170px">
          </div>
          <p class="editor-label"><input id="title" class='editor-input' placeholder="这里输入标题" value='${title}'></p>
          <p class="editor-label"><input id="author" class='editor-input' placeholder="这里输入作者" value='${author}'></p>
          <p class="editor-label"><input id="square" class='editor-input' placeholder="这里添加分类" value='${square}'></p>
          <textarea class='editor-textarea' id="markdown" placeholder="这里输入正文">${mdData}</textarea>
          <button class='editor-button' onclick='postData()'>保存</button>
          <button class='editor-button'>发布</button>
          </div>`
        let js = document.createElement('script')
        js.src = './editor.js'
        container.appendChild(js)
      })
      location.href += `/editor?id=${uuid}`;
    })





}
