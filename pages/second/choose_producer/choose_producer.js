var e, t, a, r = getApp(), o = require("../../../utils/bmob_new.js");

Page({
    data: {
        StatusBar: r.globalData.StatusBar,
        CustomBar: r.globalData.CustomBar,
        hidden: !0,
        producers: [],
        isEmpty: !1
    },
    getproducer_list: function(t) {
        wx.showLoading({
            title: "加载中..."
        });
        var a = o.Query("producers");
        a.equalTo("parent", "==", t), a.limit(1e3), a.find().then(function(t) {
            0 == t.length ? (e.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (e.setData({
                producers: t,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    complete: function(t) {
        wx.showLoading({
            title: "加载中..."
        });
        var r = t.detail.value, n = o.Query("producers");
        n.equalTo("parent", "==", a), "" == r || n.equalTo("producer_name", "==", {
            $regex: r + ".*"
        }), n.find().then(function(t) {
            0 == t.length ? (e.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (e.setData({
                producers: t,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    getdetail: function(e) {
        var t = e.currentTarget.dataset.id;
        o.Query("producers").get(t).then(function(e) {
            wx.navigateBack(), wx.setStorageSync("producer", e);
        }).catch(function(e) {
            console.log(e);
        });
    },
    onLoad: function(r) {
        if (e = this, t = r.friendId, a = wx.getStorageSync("userid"), null != t) e.getproducer_list(t); else {
            var o = wx.getStorageSync("userid");
            e.getproducer_list(o);
        }
    },
    onReady: function() {},
    onShow: function() {
        wx.getStorageSync("is_add") && (e.getproducer_list(a), wx.removeStorageSync("is_add"));
    },
    goto_add: function() {
        wx.navigateTo({
            url: "../producer/producer_add/producer_add"
        });
    }
});