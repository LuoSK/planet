function HashRouter() {
  this.routers = {}
  window.addEventListener('hashchange', this.load.bind(this), false)
}
HashRouter.prototype = {
  registerIndex: function (callback = function () { }) {
    this.routers['index'] = callback
  },
  register: function (hash, callback = function () { }) {
    this.routers[hash] = callback
  },
  registerNotFound: function (callback = function () { }) {
    this.routers['404'] = callback
  },
  registerError: function (callback = function () { }) {
    this.routers['error'] = callback

  },
  load: function () {
    let hash = decodeURI(location.hash.slice(1))

    let handler
    if (!hash) {
      handler = this.routers.index
    } else if (!this.routers.hasOwnProperty(hash)) {
      handler = this.routers['404'] || function () { }
    } else {
      handler = this.routers[hash]
    }
    try {
      handler.call(this)
    } catch (e) {
      (this.routers['error'] || function () { }.call(this.e))
    }

  }
}