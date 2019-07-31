var t = getApp(), e = require("../../../utils/bmob_new.js"), 
a = void 0, o = void 0,
//  s = wx.getStorageSync("userid");
  s= "5800001c88";

Page({
    data: {
        StatusBar: t.globalData.StatusBar,
        CustomBar: t.globalData.CustomBar,
        hidden: !0,
        stocks: [],
        isEmpty: !1
    },
    getstock_list: function(t) {
        wx.showLoading({
            title: "加载中..."
        });
        var o = e.Query("stocks");
        o.equalTo("parent", "==", t), o.limit(1e3), o.find().then(function(t) {
            0 == t.length ? (a.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (a.setData({
                stocks: t,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    complete: function(t) {
        wx.showLoading({
            title: "加载中..."
        });
        var o = t.detail.value, i = e.Query("stocks");
        "" == o || i.equalTo("stock_name", "==", {
            $regex: o + ".*"
        }), i.equalTo("parent", "==", s), i.find().then(function(t) {
            0 == t.length ? (a.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (a.setData({
                stocks: t,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    getdetail: function(t) {
        var e = t.currentTarget.dataset.id, a = t.currentTarget.dataset.item;
        wx.showActionSheet({
            itemList: [ "查看详情", "查看库存" ],
            success: function(t) {
                console.log(t.tapIndex), 0 == t.tapIndex ? wx.navigateTo({
                    url: "stocks_add/stocks_add?id=" + e
                }) : 1 == t.tapIndex && (wx.navigateTo({
                    url: "/pages/goods/goods"
                }), wx.setStorageSync("stock", a));
            },
            fail: function(t) {
                console.log(t.errMsg);
            }
        });
    },
    onLoad: function(t) {
        a = this, o = wx.getStorageSync("userid"), a.getstock_list(o);
    },
    onReady: function() {},
    onShow: function() {
        wx.getStorageSync("is_add") && (a.getstock_list(o), wx.removeStorageSync("is_add"));
    },
    goto_add: function() {
        wx.navigateTo({
            url: "../stocks/stocks_add/stocks_add"
        });
    }
});