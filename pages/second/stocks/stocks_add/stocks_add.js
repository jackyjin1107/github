var t, o = require("../../../../component/base/index.js").$Message, e = require("../../../../utils/bmob_new.js"), n = void 0;

Page({
    data: {
        loading: !1
    },
    handleAddCustoms: function(s) {
        var a = s.detail.value;
        if (null == a.stock_type) o({
            content: "请输入仓库编号",
            type: "warning",
            duration: 5
        }); else if (null == a.stock_name) o({
            content: "请输入仓库名字",
            type: "warning",
            duration: 5
        }); else {
            t.setData({
                loading: !0
            });
            var c, i = wx.getStorageSync("userid"), d = e.Pointer("_User");
            c = null == n ? d.set(i) : d.set(n);
            var l = e.Query("stocks");
            l.set("stock_type", t.daxie(a.stock_type)), l.set("stock_name", a.stock_name), l.set("stock_manage", null == a.stock_manage ? "" : a.stock_manage), 
            l.set("stock_address", null == a.stock_address ? "" : a.stock_address), l.set("parent", c), 
            null != t.data.stock && l.set("id", t.data.stock.objectId), l.save().then(function(o) {
                t.setData({
                    loading: !1
                }), wx.setStorageSync("is_add", !0), null != t.data.stock ? wx.showToast({
                    title: "修改成功"
                }) : (wx.showToast({
                    title: "添加成功"
                }), t.setData({
                    stock: null
                }));
            }).catch(function(t) {
                console.log(t);
            });
        }
    },
    _delete: function() {
        wx.showModal({
            title: "提示",
            content: "是否删除此仓库",
            success: function(o) {
                o.confirm && e.Query("stocks").destroy(t.data.stock.objectId).then(function(t) {
                    console.log(t), wx.showToast({
                        title: "删除成功",
                        duration: 1e3,
                        success: function() {
                            wx.navigateBack(), wx.setStorageSync("is_add", !0);
                        }
                    });
                }).catch(function(t) {
                    console.log(t);
                });
            }
        });
    },
    daxie: function(t) {
        return (t = t.toString()).toUpperCase();
    },
    make_phone: function() {
        wx.makePhoneCall({
            phoneNumber: t.data.stock.stock_phone
        });
    },
    getmoney_detail: function() {
        wx.navigateTo({
            url: "../../../order_history/order_history?stock_id=" + t.data.stock.objectId
        });
    },
    onLoad: function(o) {
        console.log(o), t = this;
        var s = o.id;
        n = o.friendId, null != s ? e.Query("stocks").get(s).then(function(o) {
            console.log(o), t.setData({
                stock: o,
                is_modify: !0
            });
        }).catch(function(t) {
            console.log(t);
        }) : t.setData({
            is_modify: !1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});