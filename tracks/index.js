"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
});
class Uploader {
  constructor(t) {
    this.growingio = t, this.messageQueue = [], this.uploadingQueue = [], this.uploadTimer = null, this.projectId = this.growingio.projectId, this.appId = this.growingio.appId, this.host = this.growingio.host, this.url = `${this.host}/projects/${this.projectId}/apps/${this.appId}/collect`
  }
  upload(t) {
    this.messageQueue.push(t), this.uploadTimer || (this.uploadTimer = setTimeout(() => {
      this._flush(), this.uploadTimer = null
    }, 1e3))
  }
  forceFlush() {
    this.uploadTimer && (clearTimeout(this.uploadTimer), this.uploadTimer = null), this._flush()
  }
  _flush() {
    this.uploadingQueue = this.messageQueue.slice(), this.messageQueue = [], this.uploadingQueue.length > 0 && wx.request({
      url: `${this.url}?stm=${Date.now()}`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      data: this.uploadingQueue,
      success: () => {
        this.messageQueue.length > 0 && this._flush()
      },
      fail: () => {
        this.messageQueue = this.uploadingQueue.concat(this.messageQueue)
      }
    })
  }
}
var Utils = {
  sdkVer: "1.8.4",
  devVer: 1,
  guid: function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
      var e = 16 * Math.random() | 0;
      return ("x" == t ? e : 3 & e | 8).toString(16)
    })
  },
  getScreenHeight: function(t) {
    return Math.round(t.screenHeight * t.pixelRatio)
  },
  getScreenWidth: function(t) {
    return Math.round(t.screenWidth * t.pixelRatio)
  },
  getOS: function(t) {
    if (t) {
      var e = t.toLowerCase();
      return -1 != e.indexOf("android") ? "Weixin-Android" : -1 != e.indexOf("ios") ? "Weixin-iOS" : t
    }
  },
  getOSV: t => `Weixin ${t}`,
  isEmpty: t => {
    for (var e in t)
      if (t.hasOwnProperty(e)) return !1;
    return !0
  }
};
class Page$1 {
  constructor() {
    this.queries = {}
  }
  touch(t) {
    this.path = t.route, this.time = Date.now(), this.query = this.queries[t.route] ? this.queries[t.route] : void 0
  }
  addQuery(t, e) {
    this.queries[t.route] = e ? this._getQuery(e) : null
  }
  _getQuery(t) {
    return Object.keys(t).map(e => `${e}=${t[e]}`).join("&")
  }
}
const eventTypeMap = {
    tap: ["tap", "click"],
    longtap: ["longtap"],
    input: ["input"],
    blur: ["change", "blur"],
    submit: ["submit"],
    focus: ["focus"]
  },
  fnExpRE = /^function[^\(]*\([^\)]+\).*[^\.]+\.([^\(]+)\(.*/;

function getComKey(t) {
  return t && t.$attrs ? t.$attrs.mpcomid : "0"
}

function getVM(t, e) {
  void 0 === e && (e = []);
  var i = e.slice(1);
  return i.length ? i.reduce(function(t, e) {
    for (var i = t.$children.length, n = 0; i > n; n++) {
      var s = t.$children[n];
      if (getComKey(s) === e) return t = s
    }
    return t
  }, t) : t
}

function getHandle(t, e, i) {
  void 0 === i && (i = []);
  var n = [];
  if (!t || !t.tag) return n;
  var s = t || {},
    r = s.data;
  void 0 === r && (r = {});
  var o = s.children;
  void 0 === o && (o = []);
  var a = s.componentInstance;
  a ? Object.keys(a.$slots).forEach(function(t) {
    var s = a.$slots[t];
    (Array.isArray(s) ? s : [s]).forEach(function(t) {
      n = n.concat(getHandle(t, e, i))
    })
  }) : o.forEach(function(t) {
    n = n.concat(getHandle(t, e, i))
  });
  var h = r.attrs,
    g = r.on;
  return h && g && h.eventid === e && i.forEach(function(t) {
    var e = g[t];
    "function" == typeof e ? n.push(e) : Array.isArray(e) && (n = n.concat(e))
  }), n
}
class VueProxy {
  constructor(t) {
    this.vueVM = t
  }
  getHandle(t) {
    var e = t.type,
      i = t.target;
    void 0 === i && (i = {});
    var n = (t.currentTarget || i).dataset;
    void 0 === n && (n = {});
    var s = n.comkey;
    void 0 === s && (s = "");
    var r = n.eventid,
      o = getVM(this.vueVM, s.split(","));
    if (o) {
      var a = getHandle(o._vnode, r, eventTypeMap[e] || [e]);
      if (a.length) {
        var h = a[0];
        if (h.isProxied) return h.proxiedName;
        try {
          var g = ("" + h).replace("\n", "");
          if (g.match(fnExpRE)) {
            var u = fnExpRE.exec(g);
            if (u && u.length > 1) return u[1]
          }
        } catch (t) {}
        return h.name
      }
    }
  }
}
class Observer {
  constructor(t) {
    this.growingio = t, this.weixin = t.weixin, this.currentPage = new Page$1, this.scene = null, this._sessionId = null, this.cs1 = null, this.lastPageEvent = void 0, this.lastVstArgs = void 0, this.lastCloseTime = null, this.lastScene = void 0, this.keepAlive = t.keepAlive, this.isPauseSession = !1, this._observer = null, this.CLICK_TYPE = {
      tap: "clck",
      longpress: "lngprss",
      longtap: "lngprss"
    }
  }
  get sessionId() {
    return null === this._sessionId && (this._sessionId = Utils.guid()), this._sessionId
  }
  resetSessionId() {
    this._sessionId = null
  }
  pauseSession() {
    this.isPauseSession = !0
  }
  getVisitorId() {
    return this.weixin.uid
  }
  getUserId() {
    return this.cs1
  }
  setUserId(t) {
    var e = t + "";
    e && 100 > e.length && (this.cs1 = e, this.lastPageEvent && this._sendEvent(this.lastPageEvent))
  }
  clearUserId() {
    this.cs1 = null
  }
  collectImp(t, e = null) {
    this.growingio.vue && (t = t.$mp.page), this.growingio.taro && (t = t.$scope);
    var i = {};
    this._observer && this._observer.disconnect(), this._observer = t.isComponent ? t.createIntersectionObserver({
      observeAll: !0
    }) : wx.createIntersectionObserver(t, {
      observeAll: !0
    }), this._relative = e ? this._observer.relativeTo(e) : this._observer.relativeToViewport(), this._relative.observe(".growing_collect_imp", t => {
      t.id && !i[t.id] && (this.track(t.dataset.gioTrack && t.dataset.gioTrack.name, t.dataset.gioTrack && t.dataset.gioTrack.properties), i[t.id] = !0)
    })
  }
  appListener(t, e, i) {
    this.isPauseSession || (this.growingio.debug && console.log("App.", e, Date.now()), "onShow" == e ? (this._parseScene(i), !this.lastCloseTime || Date.now() - this.lastCloseTime > this.keepAlive || this.lastScene && this.scene !== this.lastScene ? (this.resetSessionId(), this.sendVisitEvent(i), this.lastVstArgs = i, this.lastPageEvent = void 0) : this.useLastPageTime = !0) : "onHide" == e ? (this.lastScene = this.scene, this.growingio.forceFlush(), this.weixin.syncStorage(), this.isPauseSession || (this.lastCloseTime = Date.now(), this.sendVisitCloseEvent())) : "onError" == e && this.sendErrorEvent(i))
  }
  pageListener(t, e, i) {
    if (this.growingio.debug && console.log("Page.", t.route, "#", e, Date.now()), "onShow" === e) this.isPauseSession ? this.isPauseSession = !1 : (this.currentPage.touch(t), this.sendPage(t));
    else if ("onLoad" === e) {
      Utils.isEmpty(n = i[0]) || this.currentPage.addQuery(t, n)
    } else if ("onHide" === e) this._observer && this._observer.disconnect();
    else if ("onShareAppMessage" === e) {
      var n = null,
        s = null;
      2 > i.length ? 1 === i.length && (i[0].from ? n = i[0] : i[0].title && (s = i[0])) : (n = i[0], s = i[1]), this.pauseSession(), this.sendPageShare(t, n, s)
    } else if ("onTabItemTap" === e) {
      this.sendTabClick(i[0])
    }
  }
  actionListener(t, e) {
    if ("handleProxy" === e && this.growingio.vueRootVMs && this.growingio.vueRootVMs[this.currentPage.path]) {
      let i = new VueProxy(this.growingio.vueRootVMs[this.currentPage.path]).getHandle(t);
      i && (e = i)
    }
    this.growingio.taroRootVMs && this.growingio.taroRootVMs[e] && (e = this.growingio.taroRootVMs[e]), this.growingio.debug && console.log("Click on ", e, Date.now()), "tap" === t.type || "longpress" === t.type ? this.sendClick(t, e) : -1 !== ["change", "confirm", "blur"].indexOf(t.type) ? this.sendChange(t, e) : "getuserinfo" === t.type ? (this.sendClick(t, e), t.detail && t.detail.userInfo && this.setVisitor(t.detail.userInfo)) : "getphonenumber" === t.type ? this.sendClick(t, e) : "contact" === t.type ? this.sendClick(t, e) : "submit" === t.type && this.sendSubmit(t, e)
  }
  getLocation() {
    this.growingio.getLocation = !0, this.sendVisitEvent(this.lastVstArgs)
  }
  track(t, e) {
    if (null !== t && void 0 !== t && 0 !== t.length) {
      var i = {
        t: "cstm",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query,
        n: t
      };
      null !== e && "object" == typeof e && (i.var = e), this._sendEvent(i)
    }
  }
  identify(t, e) {
    void 0 !== t && 0 !== t.length && (this.growingio.login(t), this._sendEvent({
      t: "vstr",
      var: {
        openid: t,
        unionid: e
      }
    }))
  }
  setVisitor(t) {
    this._sendEvent({
      t: "vstr",
      var: t
    })
  }
  setUser(t) {
    this._sendEvent({
      t: "ppl",
      var: t
    })
  }
  setPage(t) {
    this._sendEvent({
      t: "pvar",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      var: t
    })
  }
  setEvar(t) {
    this._sendEvent({
      t: "evar",
      var: t
    })
  }
  sendVisitEvent(t) {
    var e = this.weixin.systemInfo,
      i = {
        t: "vst",
        tm: Date.now(),
        av: Utils.sdkVer,
        db: e.brand,
        dm: e.model.replace(/<.*>/, ""),
        sh: Utils.getScreenHeight(e),
        sw: Utils.getScreenWidth(e),
        os: Utils.getOS(e.platform),
        osv: Utils.getOSV(e.version),
        l: e.language
      };
    if (this.growingio.appVer && (i.cv = this.growingio.appVer + ""), t.length > 0) {
      var n = t[0];
      i.p = n.path, Utils.isEmpty(n.query) || (i.q = this.currentPage._getQuery(n.query)), i.ch = `scn:${this.scene}`, n.referrerInfo && n.referrerInfo.appId && (i.rf = n.referrerInfo.appId)
    }
    this.weixin.getNetworkType().then(t => {
      t && (i.nt = t.networkType, this.growingio.getLocation ? this.weixin.requestLocation().then(() => {
        null != this.weixin.location && (i.lat = this.weixin.location.latitude, i.lng = this.weixin.location.longitude), this._sendEvent(i)
      }) : this._sendEvent(i))
    })
  }
  sendVisitCloseEvent() {
    this._sendEvent({
      t: "cls",
      p: this.currentPage.path,
      q: this.currentPage.query
    })
  }
  sendErrorEvent(t) {
    if (t && t.length > 0) {
      let e = t[0].split("\n");
      if (e && e.length > 1) {
        let t = e[1].split(";");
        if (t && t.length > 1) {
          let i = t[1].match(/at ([^ ]+) page (.*) function/),
            n = {
              key: e[0],
              error: t[0]
            };
          i && i.length > 2 && (n.page = i[1], n.function = i[2]), this._sendEvent({
            t: "cstm",
            ptm: this.currentPage.time,
            p: this.currentPage.path,
            q: this.currentPage.query,
            n: "onError",
            var: n
          })
        }
      }
    }
  }
  sendPage(t) {
    var e = {
      t: "page",
      tm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query
    };
    this.lastPageEvent ? (e.rp = this.lastPageEvent.p, this.useLastPageTime && (e.tm = this.lastPageEvent.tm, this.useLastPageTime = !1)) : e.rp = this.scene ? `scn:${this.scene}` : null, t.data && t.data.pvar && (e.var = t.data.pvar);
    var i = this.weixin.getPageTitle(t);
    i && i.length > 0 && (e.tl = i), this._sendEvent(e), this.lastPageEvent = e
  }
  sendPageShare(t, e, i) {
    this._sendEvent({
      t: "cstm",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      n: "onShareAppMessage",
      var: {
        from: e ? e.from : void 0,
        target: e && e.target ? e.target.id : void 0,
        title: i ? i.title : void 0,
        path: i ? i.path : void 0
      }
    })
  }
  sendClick(t, e) {
    var i = {
        t: this.CLICK_TYPE[t.type] || "clck",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query
      },
      n = t.currentTarget,
      s = {
        x: `${n.id}#${e}`
      };
    n.dataset.title ? s.v = n.dataset.title : n.dataset.src && (s.h = n.dataset.src), void 0 !== n.dataset.index && (s.idx = /^[\d]+$/.test(n.dataset.index) ? parseInt(n.dataset.index) : -1), i.e = [s], this._sendEvent(i)
  }
  sendSubmit(t, e) {
    var i = {
      t: "sbmt",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query
    };
    i.e = [{
      x: `${t.currentTarget.id}#${e}`
    }], this._sendEvent(i)
  }
  sendChange(t, e) {
    var i = {
        t: "chng",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query
      },
      n = t.currentTarget,
      s = {
        x: `${n.id}#${e}`
      };
    if (-1 !== ["blur", "change", "confirm"].indexOf(t.type) && n.dataset.growingTrack) {
      if (!t.detail.value || 0 === t.detail.value.length) return;
      "string" == typeof t.detail.value ? s.v = t.detail.value : "[object Array]" === Object.prototype.toString.call(t.detail.value) && (s.v = t.detail.value.join(","))
    }
    "change" === t.type && t.detail && t.detail.source && "autoplay" === t.detail.source || (i.e = [s], this._sendEvent(i))
  }
  sendTabClick(t) {
    var e = {
      t: "clck",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      e: [{
        x: "#onTabItemTap",
        v: t.text,
        idx: t.index,
        h: JSON.stringify(t.pagePath)
      }]
    };
    this._sendEvent(e)
  }
  _sendEvent(t) {
    t.u = this.weixin.uid, t.s = this.sessionId, t.tm = t.tm || Date.now(), t.d = this.growingio.appId, t.b = "MinP", null !== this.cs1 && (t.cs1 = this.cs1), this.growingio.upload(t)
  }
  _parseScene(t) {
    if (t.length > 0) {
      var e = t[0];
      e.scene && (this.scene = e.scene)
    }
  }
}
class Weixin {
  constructor(t) {
    this._location = null, this._systemInfo = null, this._uid = wx.getStorageSync("_growing_uid_"), this._uid && 36 !== this._uid.length && (t.forceLogin = !1), this._esid = wx.getStorageSync("_growing_esid_")
  }
  get location() {
    return this._location
  }
  get systemInfo() {
    return null == this._systemInfo && (this._systemInfo = wx.getSystemInfoSync()), this._systemInfo
  }
  set esid(t) {
    this._esid = t, wx.setStorageSync("_growing_esid_", this._esid)
  }
  get esid() {
    return this._esid || (this._esid = 1), this._esid
  }
  set uid(t) {
    this._uid = t, wx.setStorageSync("_growing_uid_", this._uid)
  }
  get uid() {
    return this._uid || (this.uid = Utils.guid()), this._uid
  }
  syncStorage() {
    wx.getStorageSync("_growing_uid_") || wx.setStorageSync("_growing_uid_", this._uid)
  }
  requestLocation() {
    return new Promise(t => {
      this._getLocation().then(e => (this._location = e, t(e)))
    })
  }
  getNetworkType() {
    return new Promise(t => {
      wx.getNetworkType({
        success: e => t(e),
        fail: () => t(null)
      })
    })
  }
  getPageTitle(t) {
    var e = "";
    try {
      if (t.data.title && t.data.title.length > 0 && (e = Array.isArray(t.data.title) ? t.data.title.join(" ") : t.data.title), 0 === e.length && __wxConfig) {
        if (__wxConfig.tabBar) {
          var i = __wxConfig.tabBar.list.find(e => e.pathPath == t.route || e.pagePath == `${t.route}.html`);
          i && i.text && (e = i.text)
        }
        if (0 == e.length) {
          var n = __wxConfig.page[t.route] || __wxConfig.page[`${t.route}.html`];
          e = n ? n.window.navigationBarTitleText : __wxConfig.global.window.navigationBarTitleText
        }
      }
    } catch (t) {}
    return e
  }
  _getSetting() {
    return new Promise(t => {
      wx.getSetting({
        success: t,
        fail: t
      })
    })
  }
  _getLocation() {
    return new Promise(t => {
      wx.getLocation({
        success: t,
        fail: function() {
          return t(null)
        }
      })
    })
  }
}
var VdsInstrumentAgent = {
  defaultPageCallbacks: {},
  defaultAppCallbacks: {},
  appHandlers: ["onShow", "onHide", "onError"],
  pageHandlers: ["onLoad", "onShow", "onShareAppMessage", "onTabItemTap", "onHide"],
  actionEventTypes: ["tap", "longpress", "blur", "change", "submit", "confirm", "getuserinfo", "getphonenumber", "contact"],
  originalPage: Page,
  originalApp: App,
  originalComponent: Component,
  originalBehavior: Behavior,
  hook: function(t, e) {
    return function() {
      var i, n = arguments ? arguments[0] : void 0;
      if (n && n.currentTarget && -1 != VdsInstrumentAgent.actionEventTypes.indexOf(n.type)) try {
        VdsInstrumentAgent.observer.actionListener(n, t)
      } catch (t) {
        console.error(t)
      }
      if (this._growing_app_ && "onShow" !== t ? i = e.apply(this, arguments) : this._growing_page_ && -1 === ["onShow", "onLoad", "onTabItemTap"].indexOf(t) && (i = e.apply(this, arguments)), this._growing_app_ && -1 !== VdsInstrumentAgent.appHandlers.indexOf(t)) {
        try {
          VdsInstrumentAgent.defaultAppCallbacks[t].apply(this, arguments)
        } catch (t) {
          console.error(t)
        }
        "onShow" === t && (i = e.apply(this, arguments))
      }
      if (this._growing_page_ && -1 !== VdsInstrumentAgent.pageHandlers.indexOf(t)) {
        var s = Array.prototype.slice.call(arguments);
        i && s.push(i);
        try {
          VdsInstrumentAgent.defaultPageCallbacks[t].apply(this, s)
        } catch (t) {
          console.error(t)
        }
        if (-1 !== ["onShow", "onLoad", "onTabItemTap", "onHide"].indexOf(t)) i = e.apply(this, arguments);
        else {
          var r = VdsInstrumentAgent.observer.growingio;
          r && r.followShare && i.path && (i.path = -1 === i.path.indexOf("?") ? i.path + "?suid=" + r.weixin.uid : i.path + "&suid=" + r.weixin.uid)
        }
      }
      return i
    }
  },
  hookComponent: function(t, e) {
    return function() {
      var i = arguments ? arguments[0] : void 0;
      if (i && i.currentTarget && -1 != VdsInstrumentAgent.actionEventTypes.indexOf(i.type)) try {
        VdsInstrumentAgent.observer.actionListener(i, t)
      } catch (t) {
        console.error(t)
      }
      return e.apply(this, arguments)
    }
  },
  instrument: function(t) {
    for (var e in t) "function" == typeof t[e] && (t[e] = this.hook(e, t[e]));
    return t._growing_app_ && VdsInstrumentAgent.appHandlers.map(function(e) {
      t[e] || (t[e] = VdsInstrumentAgent.defaultAppCallbacks[e])
    }), t._growing_page_ && VdsInstrumentAgent.pageHandlers.map(function(e) {
      t[e] || "onShareAppMessage" === e || (t[e] = VdsInstrumentAgent.defaultPageCallbacks[e])
    }), t
  },
  instrumentTaroPageComponent: function(t) {
    if (t.methods) {
      let e = t.methods;
      for (let i in e)
        if ("function" == typeof e[i] && -1 != VdsInstrumentAgent.pageHandlers.indexOf(i)) {
          const n = e[i];
          t.methods[i] = function() {
            return VdsInstrumentAgent.observer.pageListener(this, i, arguments), n.apply(this, arguments)
          }
        }
    }
    return t
  },
  instrumentComponent: function(t) {
    if (t.methods) {
      let e = t.methods;
      for (let i in e) "function" == typeof e[i] && (t.methods[i] = this.hookComponent(i, e[i]))
    }
    return t
  },
  GrowingPage: function(t) {
    return t._growing_page_ = !0, VdsInstrumentAgent.originalPage(VdsInstrumentAgent.instrument(t))
  },
  GrowingComponent: function(t) {
    return VdsInstrumentAgent.originalComponent(VdsInstrumentAgent.instrumentComponent(t))
  },
  GrowingBehavior: function(t) {
    return VdsInstrumentAgent.originalBehavior(VdsInstrumentAgent.instrumentComponent(t))
  },
  GrowingApp: function(t) {
    return t._growing_app_ = !0, VdsInstrumentAgent.originalApp(VdsInstrumentAgent.instrument(t))
  },
  initInstrument: function(t, e) {
    VdsInstrumentAgent.observer = t, VdsInstrumentAgent.pageHandlers.forEach(function(t) {
      VdsInstrumentAgent.defaultPageCallbacks[t] = function() {
        this.__route__ && VdsInstrumentAgent.observer.pageListener(this, t, arguments)
      }
    }), VdsInstrumentAgent.appHandlers.forEach(function(t) {
      VdsInstrumentAgent.defaultAppCallbacks[t] = function() {
        VdsInstrumentAgent.observer.appListener(this, t, arguments)
      }
    }), e ? (global.GioPage = VdsInstrumentAgent.GrowingPage, global.GioApp = VdsInstrumentAgent.GrowingApp, global.GioComponent = VdsInstrumentAgent.GrowingBehavior, global.GioBehavior = VdsInstrumentAgent.GrowingBehavior) : (Page = function() {
      return VdsInstrumentAgent.GrowingPage(arguments[0])
    }, App = function() {
      return VdsInstrumentAgent.GrowingApp(arguments[0])
    }, Component = function() {
      return VdsInstrumentAgent.GrowingComponent(arguments[0])
    }, Behavior = function() {
      return VdsInstrumentAgent.GrowingBehavior(arguments[0])
    })
  }
};
Object.getOwnPropertyDescriptors || (Object.getOwnPropertyDescriptors = function(t) {
  const e = {};
  for (let i of Reflect.ownKeys(t)) e[i] = Object.getOwnPropertyDescriptor(t, i);
  return e
});
class GrowingIO {
  constructor() {
    this.uploadingMessages = []
  }
  init(t, e, i = {}) {
    this.projectId = t, this.appId = e, this.appVer = i.version, this.debug = i.debug || !1, this.forceLogin = i.forceLogin || !1, this.followShare = i.followShare || !1, this.usePlugin = i.usePlugin || !1, this.getLocation = i.getLocation || !1, this.keepAlive = +i.keepAlive || 3e4, this.vue = !!i.vue, this.taro = !!i.taro, this.weixin = new Weixin(this), this.esid = this.weixin.esid, this.host = "https://wxapi.growingio.com", i.host && i.host.indexOf("http") >= 0 && (this.host = "https://" + i.host.slice(i.host.indexOf("://") + 3)), this.uploader = new Uploader(this), this.observer = new Observer(this), i.vue && (this.vueRootVMs = {}, this._proxyVue(i.vue)), i.taro && (this.taroRootVMs = {}, this._proxyTaro(i.taro)), this._start()
  }
  setVue(t) {
    this.vueRootVMs || (this.vueRootVMs = {}), this.vue = !0, this._proxyVue(t)
  }
  login(t) {
    if (this.forceLogin)
      for (var e of (this.weixin.uid = t, this.forceLogin = !1, this.uploadingMessages)) e.u = t, this._upload(e)
  }
  upload(t) {
    this.forceLogin ? this.uploadingMessages.push(t) : this._upload(t)
  }
  forceFlush() {
    this.weixin.esid = this.esid, this.uploader.forceFlush()
  }
  proxy(t, e) {
    try {
      if ("setVue" === t) this.setVue(e[0]);
      else if (this.observer && this.observer[t]) return this.observer[t].apply(this.observer, e)
    } catch (t) {
      console.error(t)
    }
  }
  _start() {
    VdsInstrumentAgent.initInstrument(this.observer, this.usePlugin);
    try {
      global && (global.App = App, global.Page = Page, global.Component = Component)
    } catch (t) {
      console.error(t)
    }
  }
  _upload(t) {
    t.esid = this.esid++, this.debug && console.info("generate new event", JSON.stringify(t, 0, 2)), this.uploader.upload(t)
  }
  _proxyTaro(t) {
    let e = this;
    const i = t.createComponent;
    t.createComponent = function(t, n) {
      let s = t;
      for (; s && s.prototype;) {
        const i = Object.keys(Object.getOwnPropertyDescriptors(s.prototype) || {});
        for (let n = 0; i.length > n; n++)
          if (i[n].startsWith("func__")) {
            const r = s.name,
              o = i[n].slice(6);
            e.taroRootVMs[i[n]] = r + "_" + ("" + t.prototype[i[n]]).match(/this\.__triggerPropsFn\(\"(.+)\",/)[1] + "_" + o
          }
        s = Object.getPrototypeOf(s)
      }
      const r = i(t, n);
      return n && VdsInstrumentAgent.instrumentTaroPageComponent(r), r
    }
  }
  _proxyVue(t) {
    if (void 0 !== t.mixin) {
      let e = this;
      t.mixin({
        created: function() {
          if (!this.$options.methods) return;
          const t = Object.keys(this.$options.methods);
          for (let e of Object.keys(this)) 0 > t.indexOf(e) || (Object.defineProperty(this[e], "proxiedName", {
            value: e
          }), Object.defineProperty(this[e], "isProxied", {
            value: !0
          }))
        },
        beforeMount: function() {
          let t = this.$root;
          t.$mp && "page" === t.$mp.mpType && t.$mp.page && (e.vueRootVMs[t.$mp.page.route] = t)
        }
      })
    }
  }
}
var growingio = new GrowingIO,
  gio = function() {
    var t = arguments[0];
    if (t) {
      var e = 2 > arguments.length ? [] : [].slice.call(arguments, 1);
      if ("init" !== t) return growingio.proxy(t, e);
      if (e.length < 2) console.log("初始化 GrowingIO SDK 失败。请使用 gio('init', '你的GrowingIO项目ID', '你的微信APP_ID', options);");
      else growingio.init(e[0], e[1], e[2])
    }
  };
console.log("init growingio...");
const GioPage = VdsInstrumentAgent.GrowingPage,
  GioApp = VdsInstrumentAgent.GrowingApp,
  GioComponent = VdsInstrumentAgent.GrowingComponent,
  GioBehavior = VdsInstrumentAgent.GioBehavior;
exports.GioPage = GioPage, exports.GioApp = GioApp, exports.GioComponent = GioComponent, exports.GioBehavior = GioBehavior, exports.default = gio;