function HistoryRouter() {
  this.routers = {};
  this.listenLink();
  this.listenPopstate();
}
HistoryRouter.prototype = {
  // 路由注册
  register: function (path, callback = function () {}) {
    this.routers[path] = callback;
  },

  // 首页注册
  registerIndex: function (callback = function () {}) {
    this.routers["/"] = callback;
  },

  // 404处理
  registerNotFound: function (callback = function () {}) {
    this.routers["404"] = callback;
  },

  // 异常处理
  registerError: function (callback = function () {}) {
    this.routers["error"] = callback;
  },

  // 监听popstate
  listenPopstate: function () {
    window.addEventListener("popstate", (e) => {
      const state = e.state || {};
      const path = state.path || "";
      this.dealPathHandler(path);
    }, false);
  },

  // 全局监听a链接
  listenLink: function () {
    window.addEventListener("click", (e) => {
      const dom = e.target;
      if (dom.tagName.toUpperCase() === "A" && dom.getAttribute("href")) {
        e.preventDefault();
        this.assign(dom.getAttribute("href"));
      }
    }, false);
  },

  // 跳转到path
  assign: function (path) {
    history.pushState({ path }, null, path);
    this.dealPathHandler(path);
  },

  // 替换成path
  replace: function (path) {
    history.replaceState({ path }, null, path);
    this.dealPathHandler(path);
  },

  // 初始化
  load: function () {
    const path = location.pathname;
    this.dealPathHandler(path);
  },
  dealPathHandler: function (path) {
    console.log(path);
    let handler;
    if (!this.routers.hasOwnProperty(path)) {
      handler = this.routers["404"] || function () {};
    } else {
      handler = this.routers[path];
    }
    try {
      handler.call(this);
    } catch (e) {
      (this.routers["error"] || function () {}).call(this, e);
    }
  },
};
