var e = getApp(), t = require("../../../utils/bmob_new.js"), o = void 0, n = void 0, i = wx.getStorageSync("userid");

Page({
    data: {
        StatusBar: e.globalData.StatusBar,
        CustomBar: e.globalData.CustomBar,
        hidden: !0,
        producers: [],
        isEmpty: !1
    },
    getproducer_list: function(e) {
        wx.showLoading({
            title: "加载中..."
        });
        var n = t.Query("producers");
        n.equalTo("parent", "==", e), n.limit(1e3), n.find().then(function(e) {
            0 == e.length ? (o.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (o.setData({
                producers: e,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    complete: function(e) {
        wx.showLoading({
            title: "加载中..."
        });
        var n = e.detail.value, a = t.Query("producers");
        "" == n || a.equalTo("producer_name", "==", {
            $regex: n + ".*"
        }), a.equalTo("parent", "==", i), a.find().then(function(e) {
            0 == e.length ? (o.setData({
                isEmpty: !0
            }), wx.hideLoading()) : (o.setData({
                producers: e,
                isEmpty: !1
            }), wx.hideLoading());
        });
    },
    getdetail: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: [ "查看详情" ],
            success: function(e) {
                console.log(e.tapIndex), 0 == e.tapIndex ? wx.navigateTo({
                    url: "producer_add/producer_add?id=" + t
                }) : 1 == e.tapIndex ? (producer_id = t, o.setData({
                    visible: !0
                })) : 2 == e.tapIndex && wx.navigateTo({
                    url: "debt_history/debt_history?id=" + t
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    getmoney_number: function(e) {
        input_money = e.detail.detail.value;
    },
    handlegetId: function() {
        null == input_money || 0 == input_money.length ? wx.showToast({
            title: "请输入收款金额",
            icon: "none"
        }) : (wx.showLoading({
            title: "加载中..."
        }), o.setData({
            visible: !1
        }), t.Query("producers").get(producer_id).then(function(e) {
            if (e.debt - Number(input_money) < 0) wx.hideLoading(), wx.showToast({
                icon: "none",
                title: "收款金额过大"
            }); else if (null == e.debt || 0 == e.debt) wx.hideLoading(), wx.showToast({
                icon: "none",
                title: "该客户没有欠款"
            }); else {
                e.set("debt", e.debt - Number(input_money)), e.save();
                var n = t.Pointer("producers").set(producer_id), a = t.Pointer("_User").set(wx.getStorageSync("userid")), d = t.Query("debt_history");
                d.set("producer", n), d.set("master", a), d.set("debt_number", Number(input_money)), 
                d.save().then(function(e) {
                    console.log(e), wx.hideLoading(), o.getproducer_list(i), wx.showToast({
                        title: "收款成功"
                    });
                }).catch(function(e) {
                    console.log(e);
                });
            }
        }).catch(function(e) {
            console.log(e);
        }));
    },
    handleClose: function() {
        o.setData({
            visible: !1
        });
    },
    onLoad: function(e) {
        o = this, n = wx.getStorageSync("userid"), o.getproducer_list(n);
    },
    onReady: function() {},
    onShow: function() {
        wx.getStorageSync("is_add") && (o.getproducer_list(n), wx.removeStorageSync("is_add"));
    },
    goto_add: function() {
        wx.navigateTo({
            url: "../producer/producer_add/producer_add"
        });
    }
});