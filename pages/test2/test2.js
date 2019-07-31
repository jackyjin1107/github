var e = require("../../component/base/index.js").$Message, 
o = require("../../utils/bmob.js"), 
t = require("../../utils/bmob_new.js"), 
s = require("../../utils/config.js"), n = void 0, a = void 0, c = void 0, i = void 0;

Page({
    data: {
        packingUnits: s.units,
        goodsName: "",
        regNumber: "",
        producer: "",
        productCode: "",
        packageContent: "",
        packingUnit: "",
        packModel: "",
        costPrice: "0",
        retailPrice: "0",
        goodsClass: null,
        product_info: "",
        warning_num: 0,
        reserve: 0,
        loading: !1,
        image: "none",
        is_choose: !1
    },
    select_producttime: function(e) {
        c.setData({
            producttime: e.detail.value
        });
    },
    select_nousetime: function(e) {
        c.setData({
            nousetime: e.detail.value
        });
    },
    handleAddGoods: function(s) {
        var c = this, r = s.detail.value, d = void 0;
        "" == r.goodsName ? e({
            content: "请输入产品名称",
            type: "warning",
            duration: 5
        }) : "" == r.costPrice ? e({
            content: "请输入进货价格",
            type: "warning",
            duration: 5
        }) : "" == r.retailPrice ? e({
            content: "请输入零售价格",
            type: "warning",
            duration: 5
        }) : wx.showModal({
            title: "提示",
            content: "是否确认新增产品",
            success: function(s) {
                s.confirm && (c.setData({
                    loading: !0
                }), wx.getStorage({
                    key: "userid",
                    success: function(s) {
                        var u = o.Object.extend("Goods"), l = new u();
                        if ("1" == i) {
                            var g = o.Object.extend("class_user");
                            (p = new g()).id = c.data.goodsClass, d = "goodsClass";
                        } else if ("2" == i) {
                            var p = new (g = o.Object.extend("second_class"))();
                            p.id = c.data.goodsClass, d = "second_class";
                        }
                        if (null != a) {
                            var m = new (o.Object.extend("stocks"))();
                            m.id = a.objectId;
                        }
                        var f = new o.User();
                        f.id = s.data;
                        var w = new o.Query(u);
                        w.equalTo("goodsName", r.goodsName), null != a && w.equalTo("stocks", a.objectId), 
                        w.equalTo("userId", f), w.find({
                            success: function(o) {
                                if (o.length > 0) return e({
                                    content: "该产品已存在，请确认",
                                    type: "warning",
                                    duration: 5
                                }), void c.setData({
                                    loading: !1
                                });
                                l.set("userId", f), d && l.set(d, p), l.set("stocks", m), l.set("goodsName", r.goodsName), 
                                l.set("regNumber", r.regNumber), l.set("producer", r.producer), l.set("productCode", r.productCode), 
                                l.set("position", r.position), l.set("packageContent", r.packageContent), l.set("costPrice", r.costPrice), 
                                l.set("retailPrice", r.retailPrice), l.set("packingUnit", r.packingUnit), l.set("product_info", r.product_info), 
                                l.set("warning_num", Number(r.warning_num)), null != r.producttime && l.set("producttime", new Date(r.producttime + " 00:00:00")), 
                                null != r.nousetime && l.set("nousetime", new Date(r.nousetime + " 00:00:00")), 
                                l.set("reserve", Number(r.reserve)), l.set("stocktype", Number(r.reserve) > Number(r.warning_num) ? 1 : 0), 
                                l.save(null, {
                                    success: function(e) {
                                        if (wx.setStorageSync("is_add", !0), c.data.is_choose) {
                                            var o, s = n, a = !0, i = !1, d = void 0;
                                            try {
                                                for (var u, l = s[Symbol.iterator](); !(a = (u = l.next()).done); a = !0) {
                                                    var g = u.value;
                                                    console.log("itemn", g), o = t.File(r.goodsName + ".jpg", g);
                                                }
                                            } catch (e) {
                                                i = !0, d = e;
                                            } finally {
                                                try {
                                                    !a && l.return && l.return();
                                                } finally {
                                                    if (i) throw d;
                                                }
                                            }
                                            o.save().then(function(o) {
                                                var s = t.Query("Goods");
                                                s.set("id", e.id), s.set("goodsIcon", JSON.parse(o[0]).url), s.save().then(function(e) {
                                                    console.log(e), wx.showToast({
                                                        title: "新增产品成功",
                                                        icon: "success",
                                                        success: function() {
                                                            c.setData({
                                                                goodsName: "",
                                                                regNumber: "",
                                                                producer: "",
                                                                productCode: "",
                                                                packageContent: "",
                                                                packingUnit: "",
                                                                costPrice: "0",
                                                                retailPrice: "0",
                                                                product_info: "",
                                                                warning_num: 0,
                                                                reserve: 0,
                                                                loading: !1
                                                            });
                                                        }
                                                    });
                                                }).catch(function(e) {
                                                    console.log(e);
                                                });
                                            });
                                        } else wx.showToast({
                                            title: "新增产品成功",
                                            icon: "success",
                                            success: function() {
                                                c.setData({
                                                    goodsName: "",
                                                    regNumber: "",
                                                    producer: "",
                                                    productCode: "",
                                                    packageContent: "",
                                                    packingUnit: "",
                                                    costPrice: "0",
                                                    retailPrice: "0",
                                                    product_info: "",
                                                    reserve: 0,
                                                    loading: !1
                                                });
                                            }
                                        });
                                    },
                                    error: function(e, o) {
                                        console.log(o);
                                    }
                                });
                            },
                            error: function(e) {
                                console.log(e.code + " " + e.message);
                            }
                        });
                    }
                }));
            }
        });
    },
    choose_image: function() {
        wx.chooseImage({
            
            success: function(e) {
                console.log(e), n = e.tempFilePaths, c.setData({
                    temppath: n,
                    icon: "none",
                    image: "inline-block",
                    is_choose: !0
                });
            }
        });
    },
    onLoad: function(e) {
        c = this;
        var o = wx.getStorageSync("class");
        c.setData({
            class_text: o
        }), null != e.id && c.scan_by_id(e.id);
    },
    onReady: function() {},
    onShow: function() {
      wx.getStorage({
        key: "producer",
        success: function (e) {
          a = e.data, c.setData({
            producer: e.data.producer_name
          });
        }
      }),wx.getStorage({
            key: "stock",
            success: function(e) {
                a = e.data, c.setData({
                    stock: e.data.stock_name
                });
            }
        }), wx.getStorage({
            key: "class",
            success: function(e) {
                console.log(e), i = e.data.classtype, c.setData({
                    class_select_text: e.data.class_text,
                    goodsClass: e.data.objectId
                });
            }
        });
    },
    onHide: function() {
        wx.removeStorageSync("class");
    },
    onUnload: function() {
        wx.removeStorageSync("stock"), wx.removeStorageSync("class");
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    scan_by_id: function(e) {
        console.log(e), wx.showLoading({
            title: "加载中..."
        }), wx.request({
            url: "https://route.showapi.com/66-22",
            data: {
                showapi_appid: "84916",
                showapi_sign: "ad4b63369c834759b411a9d7fcb07ed7",
                code: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(o) {
                wx.hideLoading();
                var t = o.data.showapi_res_body;
                c.setData({
                    goodsName: t.goodsName,
                    producer: t.manuName,
                    productCode: e
                });
            }
        });
    }
});