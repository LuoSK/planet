

new Promise((resolve) => {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "/articles.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      resolve(xhr.responseText);
    }
  };
  xhr.send(null);
})
  .then((res) => {
    let data = JSON.parse(res);
    let length = data.length;
    let container = document.getElementById("container");
    let token = "";
    for (let i = 0; i < length; i++) {
      const obj = data[i];
      const time = obj.time,
        comments = obj.comments,
        title = obj.title,
        hot = obj.hot,
        excerpt = obj.excerpt,
        url = obj.url,
        square = obj.square,
        author = obj.author,
        img = obj.img;
      token += `<div class='news-info clearfix' href="#">
      <div class='news-info-article' style='position: relative;'>
        <div class='news-info-meta' style='position: absolute;top: -18px;'>
          <span class='news-square'>${square}</span>
          <span class='news-time'>${time}</span>
        </div>
        <a class='news-info-title' href="${url}">${title}</a>
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
    </div>`;
    }
    container.innerHTML = token;
  });
