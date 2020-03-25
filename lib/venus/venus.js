function Venus(source, id) {
  var token = parser(source.trim().split("\n")); //将源文件解析成一个token流
  render(token, id); // 将获取到的token流渲染成html
}
function parser(source) {
  var strArr = source; // 按行分割存入数组
  var token = ""; // 存储解析后的token 流
  var rule = new Rules(); // 生成规则对象
  var readIndex = 0; // 当前指针指向行数
  var length = strArr.length; // 行数

  // 遍历每一行
  while (readIndex < length) {
    var line = strArr[readIndex]; // 当前行内容
    var tempStr = ""; //临时token行

    // 空行
    if (line == "") {
      // 对页面前的空行进行处理
      if (readIndex == 0) {
        while (readIndex < length) {
          if (strArr[readIndex + 1] != "") break;
          readIndex++;
        }
        readIndex++;
        continue;
      }
      tempStr = "<br>";
      // 指针下潜
      while (readIndex + 1 < length) {
        if (strArr[readIndex + 1] != "") break;
        readIndex++;
      }
      token += tempStr;
      readIndex++;
      continue;
    }

    // ### 标题
    if (rule.heading.exec(line)) {
      var count = rule.heading.exec(line)[1].length;
      var text = rule.heading.exec(line)[2];
      tempStr = `<h${count} id='${text}'>${text}</h${count}>`;
      token += tempStr;
      readIndex++;
      continue;
    }

    // 分隔符
    if (rule.hr.test(line)) {
      tempStr = `<hr>`;
      token += tempStr;
      readIndex++;
      continue;
    }

    // 缩进代码块
    if (rule.code.test(line)) {
      var text = rule.code.exec(line)[1].replace(/^ {4}/, "");

      tempStr = `<p>${ESC(text)}</p>`;
      // 指针下潜
      while (readIndex + 1 < length) {
        if (!rule.code.test(strArr[readIndex + 1])) break;
        text = rule.code.exec(strArr[++readIndex])[1].replace(/^ {4}/, "");
        tempStr += `<p>${ESC(text)}</p>`;
      }

      token += `<pre class='line-numbers'><code>${tempStr}</code></pre>`;
      readIndex++;
      continue;
    }

    // 围栏代码块 ``` ~~~
    if (rule.fenceStart.test(line)) {
      var header = rule.fenceStart.exec(line);
      var startFence = header[1].trim();
      var language = header[2].trim();
      var tempStr = "";
      var text = "";
      // 指针下潜
      while (readIndex + 1 < length) {
        // 寻找闭合代码围栏
        var curLine = rule.fenceClose.test(strArr[readIndex + 1])
          ? rule.fenceClose.exec(strArr[readIndex + 1])[0].trim()
          : null;
        if (
          curLine &&
          startFence[0] == curLine[0] &&
          curLine.length >= startFence.length
        ) {
          readIndex++;
          break;
        }
        text = strArr[++readIndex];
        if (text == "") {
          tempStr += ``;
        } else {
          tempStr += `<p>${ESC(text)}</p>`;
        }
      }
      token += `<pre class='line-numbers' ><code class='language-${language}'>${tempStr}</code></pre>`;
      readIndex++;
      continue;
    }

    // 链接自定义 start 不做处理 让close做处理
    if (rule.linkdefinedStart.test(line)) {
      readIndex++;
      continue;
    }

    // 自定义链接 Close
    if (rule.linkdefinedClose.test(line)) {
      var tag = rule.linkdefinedClose.exec(line);
      var tempIndex = readIndex;
      //指针上潜
      while (tempIndex - 1 >= 0) {
        var curLine = rule.linkdefinedStart.exec(strArr[tempIndex - 1]);
        if (curLine) {
          if (tag[1] == curLine[1]) {
            var href = curLine[2].trim();
            var title = curLine[3].trim();
            tempStr = `<p><a href='${href}' title='${title}'>${tag[1]}</a></p>`;
            token += tempStr;
            break;
          }
        }
        tempIndex--;
      }
      readIndex++;
      continue;
    }
    // 块引用
    if (rule.blockquote.test(line)) {
      var tempArr = [];
      tempArr.push(line.replace(/>/, ""));
      // 指针下潜
      while (readIndex + 1 < length) {
        var curLine = strArr[readIndex + 1];
        // 寻找中断代码块
        if (
          rule.fenceStart.test(curLine) ||
          rule.heading.test(curLine) ||
          rule.linkdefinedStart.test(curLine) ||
          rule.hr.test(curLine)
        ) {
          break;
        }
        if (curLine == "") {
          readIndex + 1;
          break;
        }
        // 去除 “>” 将当前行存入数组
        var tempLine = /^\s*>?(.*)/.exec(curLine)[1];
        tempArr.push(tempLine);
        readIndex++;
      }
      var tempStr = parser(tempArr);
      token += `<blockquote>${tempStr}</blockquote>`;
      readIndex++;
      continue;
    }

    // 无序列表项
    if (rule.ul.test(line)) {
      var tempArr = [];
      token += "<ul>";
      tempArr.push(line.replace(/[-+*]\s/, ""));
      // 指针下潜
      while (readIndex + 1 < length) {
        var curLine = strArr[readIndex + 1];
        //寻找中断代码块
        if (rule.ol.test(curLine)) {
          break;
        }
        if (curLine == "") {
          if (!rule.ul.test(strArr[readIndex + 2])) {
            readIndex + 1;
            break;
          }
        }
        if (rule.ul.test(curLine)) {
          var tempStr = parser(tempArr);
          token += `<li>${tempStr}</li>`;
          tempArr = [];
        }
        // 去除 “*-+” 将当前行存入数组
        var tempLine = /^\s*([-+*]\s)?(.*)/.exec(curLine)[2];
        tempArr.push(tempLine);
        readIndex++;
      }
      if (tempArr) {
        var tempStr = parser(tempArr);
        token += `<li>${tempStr}</li>`;
      }
      token += `</ul>`;
      readIndex++;
      continue;
    }
    // 有序列表项
    if (rule.ol.test(line)) {
      var tempArr = [];
      var start = parseInt(rule.ol.exec(line)[1]);
      token += `<ol start='${start}'>`;
      tempArr.push(line.replace(/[0-9]+\. /, ""));
      // 指针下潜
      while (readIndex + 1 < length) {
        var curLine = strArr[readIndex + 1];
        //寻找中断代码块
        if (rule.ul.test(curLine)) {
          break;
        }
        if (curLine == "") {
          if (!rule.ol.test(strArr[readIndex + 2])) {
            readIndex + 1;
            break;
          }
        }
        if (rule.ol.test(curLine)) {
          var tempStr = parser(tempArr);
          token += `<li>${tempStr}</li>`;
          tempArr = [];
        }
        // 去除 数字 将当前行存入数组
        var tempLine = /^\s{0,3}([0-9]+\. )?(.*)/.exec(curLine)[2];
        tempArr.push(tempLine);
        readIndex++;
      }
      if (tempArr) {
        var tempStr = parser(tempArr);
        token += `<li>${tempStr}</li>`;
      }
      token += `</ol>`;
      readIndex++;
      continue;
    }

    // 段落处理
    token += `<p>${inlineParser(line.trim())}</p>`;
    readIndex++;
  }
  // console.log(token);
  return token;
}
// 内联元素解析
function inlineParser(p) {
  var rule = new Rules(); // 生成规则对象
  // 行内代码
  if (rule.inlineCode.test(p)) {
    p = p.replace(rule.inlineCode, function($0, $1, $2) {
      return `<code>${ESC($2)}</code>`;
    });
  }
  // 加粗 斜体
  if (rule.strong.test(p)) {
    p = p.replace(rule.strong, function($0, $1, $2) {
      if ($1.length == 1) {
        return `<em>${$2}</em>`;
      }
      if ($1.length == 2) {
        return `<strong>${$2}</strong>`;
      }
      if ($1.length >= 3) {
        return `<strong><em>${$2}</em></strong>`;
      }
    });
  }
  // 删除线
  if (rule.delete.test(p)) {
    p = p.replace(rule.delete, function($0, $1) {
      return `<del>${$1}</del>`;
    });
  }
  // 行内图片
  if (rule.inlineimg.test(p)) {
    p = p.replace(rule.inlineimg, function($0, $1, $2, $3) {
      var src = /(?<=<)\S*(?=>)/.exec($2) ? /(?<=<)\S*(?=>)/.exec($2)[0] : $2;
      var title = /(?<=[('"])\S*(?=[)'"])/.exec($3)
        ? /(?<=[('"])\S*(?=[)'"])/.exec($3)[0]
        : "";

      return `<img src='${src}' title='${title}' alt='${$1}'/>`;
    });
  }
  // 行内链接
  if (rule.inlinelink.test(p)) {
    p = p.replace(rule.inlinelink, function($0, $1, $2, $3) {
      var href = /(?<=<)\S*(?=>)/.exec($2) ? /(?<=<)\S*(?=>)/.exec($2)[0] : $2;
      var title = /(?<=[('"])\S*(?=[)'"])/.exec($3)
        ? /(?<=[('"])\S*(?=[)'"])/.exec($3)[0]
        : "";

      return `<a href='${href}' title='${title}'>${$1}</a>`;
    });
  }

  return p;
}

// 将token渲染到指定的标签中
function render(token, id) {
  var renderDiv = document.querySelector(`#${id}`);
  renderDiv.innerHTML = token;
  document.querySelectorAll("pre code").forEach(block => {
    hljs.highlightBlock(block);
  });
}

// markdown 正则匹配规则
function Rules() {
  // 块元素规则
  // this.newline = /^\n+/; // 空行

  this.hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/; // 分隔符 --- *** ___

  this.heading = /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(\n|$)/; // ATX 标题 ######

  this.code = /^(\s{4}[^\n]+\n*)+/; // 缩进代码块

  this.fenceStart = /^ {0,3}(`{3,}|~{3,})([^`]*)$/; // 围栏代码块 start

  this.fenceClose = /^ {0,3}(`{3,}|~{3,})( *)$/; // 围栏代码块 Close

  this.lheading = /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/m; // Setext 标题 === ---
  // var lheading = /^ {0,3}((?:[*-+][^ ].*)|[^*-+ ].*)\n {0,3}(=+|-+) *(\n|$)/m; // Setext 标题 === ---

  this.linkdefinedStart = /^\s{0,3}\[([\s]*[^\s].*)\]:\s*([^\s]*)(?:(?:\s+)(?:'.*'|"(.*)"))?(\s*)$/; // 链接定义 start

  this.linkdefinedClose = /^\s{0,3}\[([\s]*[^\s].*)\]$/; // 链接定义 close

  this.blockquote = /^\s{0,3}>\s*(.*)/; // 块引用

  this.ul = /^\s{0,3}[-+*]\s(.*)/; // 无序列表

  this.ol = /^\s{0,3}([0-9]+)\. (.*)/; // 有序列表

  // 内联元素规则

  this.inlineCode = /(`+)(.*?)(\1)/g; // `code`

  this.strong = /([*_]{1,3})(.*?)(\1)/g; // *strong* _strong_

  this.delete = /~~(.*?)~~/g; // ~~delete~~

  this.inlinelink = /\[(.*?)\]\(\s*(<\S*>|\S*)(?:(?:\s+('.*'|".*"|\(.*\))\s*)|\s*)\)/g; // 行内链接

  this.inlineimg = /!\[(.*?)\]\(\s*(<\S*>|\S*)(?:(?:\s+('.*'|".*"|\(.*\))\s*)|\s*)\)/; // 行内图片
}

// 转义字符处理
function ESC(temp) {
  return temp.replace(/[<>'"]+?/g, function($0) {
    if ($0 == "<") return "&lt;";
    if ($0 == ">") return "&gt;";
    if ($0 == "'") return "&quot;";
    if ($0 == '"') return "&#39;";
  });
}
