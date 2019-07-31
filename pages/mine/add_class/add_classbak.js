var e = require("../../../utils/bmob_new.js"), t = (require("../../../utils/bmob.js"), 
void 0), s = void 0, n = void 0, o = void 0, a = void 0, c = void 0, i = void 0, l = void 0;

Page({
    data: {
             type: !0
    },
    goto_goods: function(e) {
      console.log("goto_goods===="+e);
     
        var t = e.currentTarget.dataset.item,           
         s = e.currentTarget.dataset.classtype;
             t.classtype = s, console.log(t), wx.setStorageSync("class", t), wx.navigateBack({
            delta: 1
        });
    },
    selected_this_one: function(e) {
      console.log("selected_this_one====", e);
      
        i = e.currentTarget.dataset.id, t.setData({
            selected_id: e.currentTarget.dataset.id
            
        }),
          console.log("selected_id" + e.currentTarget.dataset.id);
         t.query_second_class();
    },
    add_secclass: function(e) {
      console.log("add_secclass====", e);
        c = null, t.setData({
            one_click: !0
        });
    },
    show_operation: function(e) {
        o = e.currentTarget.dataset.id, l = e.currentTarget.dataset.dbname;
        var s = e.currentTarget.dataset.value;
        wx.showActionSheet({
            itemList: [ "编辑", "删除" ],
            success: function(e) {
                console.log(e.tapIndex), 0 == e.tapIndex ? t.setData({
                    edit_visible: !0,
                    get_class_text: s
                }) : t.delete_class_text();
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    delete_class_text: function() {
        wx.showModal({
            title: "提示",
            content: "是否删除此分类",
            success: function(s) {
                s.confirm && e.Query(l).destroy(o).then(function(e) {
                    console.log(e), wx.showToast({
                        title: "删除成功"
                    }), t.getclass_list();
                }).catch(function(e) {
                    console.log(e);
                });
            }
        });
    },
    editclass_text: function(e) {
        a = e.detail.detail.value;
    },
    getclass_secondtext: function(e) {
        c = e.detail.detail.value;
    },
    getclass_text_confrim_second: function() {
      console.log("getclass_text_confrim_second");
        t.handleClose();
        var s = e.Pointer("class_user").set(i),                
        n = e.Query("second_class");
        console.log(s);
        n.set("class_text", c), 
        console.log(c);
        n.set("parent", s), 
        console.log(s);
        n.save().then(function(s) {
            console.log(s);
            var n = e.Relation("class_user").add([ s.objectId ]);
            e.Query("class_user").get(i).then(function(e) {
                e.set("second", n), e.save(), t.query_second_class();
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    getclass_text_edit: function() {
        var s = e.Query(l);
        s.set("id", o), s.set("class_text", a), s.save().then(function(e) {
            console.log(e), t.setData({
                edit_visible: !1
            }), wx.showToast({
                title: "修改成功"
            }), t.getclass_list();
        }).catch(function(e) {
            console.log(e);
        });
    },
    add_class: function() {
        t.setData({
            visible: !0
        });
    },
    handleClose: function() {
        t.setData({
            visible: !1,
            edit_visible: !1,
            one_click: !1
        });
    },
    getclass_text: function(e) {
        n = e.detail.detail.value;
    },
    getclass_text_confrim: function() {
        if (null == n || "" == n) wx.showToast({
            icon: "none",
            title: "请输入类别"
        }); else {
            wx.showLoading({
                title: "添加中..."
            });
            var o = e.Pointer("_User").set(s), a = e.Query("class_user");
            a.set("parent", o), a.set("class_text", n), a.save().then(function(e) {
                console.log(e), t.setData({
                    visible: !1
                }), t.getclass_list(), wx.hideLoading();
            }).catch(function(e) {
                console.log(e);
            });
        }
    },
    getclass_list: function() {
      console.log("getclass_list");
        wx.showLoading({
            title: "加载中..."
        });
        var n = e.Query("class_user");
        n.equalTo("parent", "==", s), n.find().then(function(e) {
            console.log(e), 0 == e.length ? t.setData({
                isEmpty: !0
            }) : (i = e[0].objectId, 
                console.log(" e[0].objectId"+i),
            t.setData({
                class_text: e,
                isEmpty: !1,
                selected_id: i
                }), console.log("setdata_selected_id" + i), t.query_second_class()), wx.hideLoading();
        });
    },
    query_second_class: function() {
        wx.showLoading({
            title: "加载中..."
        });
        var s = e.Query("class_user");
        s.field("second", i),
        console.log("second is "+i);
         s.relation("second_class").then(function(e) {
            wx.hideLoading(), t.setData({
                second_class: e.results
                
            });
           
        });
    },
    onLoad: function(e) {
        t = this,
          console.log("e.type"+e.type);
         "select" == e.type && t.setData({
            type: !1
        }), s = wx.getStorageSync("userid"), 
        t.getclass_list();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});