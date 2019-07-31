var e, o = require("../../../../component/base/index.js").$Message, n = require("../../../../utils/bmob_new.js"), t = void 0;

Page({
    data: {
        loading: !1
    },
    handleAddCustoms: function(r) {
        var a = r.detail.value;
        if (null == a.producer_type) o({
            content: "请输入供应商编号",
            type: "warning",
            duration: 5
        }); else if (null == a.producer_name) o({
            content: "请输入供应商姓名",
            type: "warning",
            duration: 5
        }); else {
            e.setData({
                loading: !0
            });
            var d, c = wx.getStorageSync("userid"), u = n.Pointer("_User");
            d = null == t ? u.set(c) : u.set(t);
            var s = n.Query("producers");
            s.set("producer_type", e.daxie(a.producer_type)), s.set("producer_name", a.producer_name), 
            s.set("producer_phone", null == a.producer_phone ? "" : a.producer_phone), s.set("producer_address", null == a.producer_address ? "" : a.producer_address), 
            s.set("parent", d), null != e.data.producer && s.set("id", e.data.producer.objectId), 
            s.save().then(function(o) {
                e.setData({
                    loading: !1
                }), wx.setStorageSync("is_add", !0), null != e.data.producer ? wx.showToast({
                    title: "修改成功"
                }) : (wx.showToast({
                    title: "添加成功"
                }), e.setData({
                    producer: null
                }));
            }).catch(function(e) {
                console.log(e);
            });
        }
    },
    _delete: function() {
        wx.showModal({
            title: "提示",
            content: "是否删除此供应商",
            success: function(o) {
                o.confirm && n.Query("producers").destroy(e.data.producer.objectId).then(function(e) {
                    console.log(e), wx.showToast({
                        title: "删除成功",
                        duration: 1e3,
                        success: function() {
                            wx.navigateBack(), wx.setStorageSync("is_add", !0);
                        }
                    });
                }).catch(function(e) {
                    console.log(e);
                });
            }
        });
    },
    daxie: function(e) {
        return (e = e.toString()).toUpperCase();
    },
    make_phone: function() {
        wx.makePhoneCall({
            phoneNumber: e.data.producer.producer_phone
        });
    },
    getmoney_detail: function() {
        wx.navigateTo({
            url: "../../../order_history/order_history?producer_id=" + e.data.producer.objectId
        });
    },
    onLoad: function(o) {
        console.log(o), e = this;
        var r = o.id;
        t = o.friendId, null != r ? n.Query("producers").get(r).then(function(o) {
            console.log(o), e.setData({
                producer: o,
                is_modify: !0
            });
        }).catch(function(e) {
            console.log(e);
        }) : e.setData({
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