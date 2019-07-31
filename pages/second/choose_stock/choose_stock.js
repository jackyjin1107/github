// pages/second/choose_stock/choose_stock.js
var t, e, a = getApp(), o = require("../../../utils/bmob_new.js"), s = wx.getStorageSync("userid");

Page({
  data: {
    StatusBar: a.globalData.StatusBar,
    CustomBar: a.globalData.CustomBar,
    hidden: !0,
    stocks: [],
    isEmpty: !1
  },
  getstock_list: function (e) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = o.Query("stocks");
    a.equalTo("parent", "==", e), a.limit(1e3), a.find().then(function (e) {
      0 == e.length ? (t.setData({
        isEmpty: !0
      }), wx.hideLoading()) : (t.setData({
        stocks: e,
        isEmpty: !1
      }), wx.hideLoading());
    });
  },
  complete: function (e) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = e.detail.value, n = o.Query("stocks");
    n.equalTo("parent", "==", s), "" == a || n.equalTo("stock_name", "==", {
      $regex: a + ".*"
    }), n.find().then(function (e) {
      0 == e.length ? (t.setData({
        isEmpty: !0
      }), wx.hideLoading()) : (t.setData({
        stocks: e,
        isEmpty: !1
      }), wx.hideLoading());
    });
  },
  getdetail: function (t) {
    var e = t.currentTarget.dataset.id;
    o.Query("stocks").get(e).then(function (t) {
      wx.navigateBack(), wx.setStorageSync("stock", t);
    }).catch(function (t) {
      console.log(t);
    });
  },
  onLoad: function (a) {
    if (t = this, null != (e = a.friendId)) t.getstock_list(e); else {
      var o = wx.getStorageSync("userid");
      t.getstock_list(o);
    }
  },
  onReady: function () { },
  onShow: function () {
    wx.getStorageSync("is_add") && (t.getstock_list(s), wx.removeStorageSync("is_add"));
  },
  goto_add: function () {
    wx.navigateTo({
      url: "../stocks/stocks_add/stocks_add"
    });
  }
});