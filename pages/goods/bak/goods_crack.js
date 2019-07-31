// pages/goods/goods.js
const Bmob = require('../../utils/bmob_now.js');
const Bmob_new = require('../../utils/bmob_new.js')
var config = require('../../utils/config.js')
var _ = require('../../utils/we-lodash.js');
var userid = '';
var now_product;
var class_text;
var that;
var type; //库存情况
var class_array; //产品类别
var select_id = null; //类别选择的id
var bad_num = null; //货损数量
var beizhu_text = ''; //备注信息
Page({
  data: {
    spinShow: false,
    goods: [],
    limitPage: 50,
    page: 1,
    isEmpty: false,
    isEnd: false,
    selectd_stockposition: "位置",
    selectd_time: "失效",
    totalGoods: [],
    inputShowed: false,
    inputVal: "",
    current: "1",
    length: null,
    visible: false,
    now_goodsName: "",
    // selectd_stock: "库存情况",
    // stock: ["库存充足", "库存不足"],
    // selectd_class: "产品类别"
  },
  // handlePageChange: function(e) {
  //   var t = e.detail.type;
  //   "next" === t ? s.data.length < s.data.limitPage ? wx.showToast({
  //     icon: "none",
  //     title: "最后一页了"
  //   }) : (s.setData({
  //     limitPage: s.data.limitPage,
  //     page: s.data.page + 1
  //   }), s.loadGoods(t, null, l)) : "prev" === t && (this.setData({
  //     page: this.data.page - 1
  //   }), s.loadGoods(t, null, l));
  // },
  //页码改变
  handlePageChange({
    detail
  }) {
    const type = detail.type;
    if (type === 'next' || this.data.length < this.data.limitPage) {
      wx.showToast({
          icon: 'none',
          title: '最后一页了',
        }),
        this.setData({
          limitPage: this.data.limitPage,
          page: this.data.page + 1
        });
      that.loadGoods(type, null, select_id);
    } else if (type === 'prev') {
      this.setData({
        page: this.data.page - 1
      });
      that.loadGoods(type, null, select_id);
    }
  },
  //已修改
  bindstock_Change: function(e) {
    if (e.detail.value == "0") {
      that.loadGoods(true, null, select_id);
      that.setData({
        selectd_stock: that.data.stock[e.detail.value]
      });
      type = true;
    } else {
      that.loadGoods(false, null, select_id);
      that.setData({
        selectd_stock: that.data.stock[e.detail.value]
      });
      type = false;
    }
  },
  bindtime_Change: function(e) {
    r = e.detail.value, s.setData({
      selectd_time: s.data.time[r]
    }), s.loadGoods(i, null, l);
  },
  bindclass_Change: function(e) {
    console.log(e), "0" == e.detail.value ? g = "createdAt" : "1" == e.detail.value && (g = "reserve"),
      s.setData({
        selectd_order: s.data.classes[e.detail.value]
      }), s.loadGoods(i, null, l);
  },
  //已修改
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  //已修改
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  //已修改
  clearInput: function() {
    this.setData({
      inputVal: "",
      goods: this.data.totalGoods
    }), this.handleResetData(), this.loadGoods();
  },
  //已修改
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //已修改
  searchAction: function(e) {
    var that = this;
    var inputVal = this.data.inputVal
    that.loadGoods(type, inputVal);
  },
  //产品点击
  handleDetial: function(e) {
    var item = e.target.dataset.item;
    now_product = item;
    wx.setStorageSync('item', JSON.stringify(item));
    wx.showActionSheet({
      itemList: ['查看详情', '货损', '查看产品图', '编辑产品', '删除产品', '取消'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/common/goods-dtl/goods-dtl?type=1'
          });
        } else if (res.tapIndex == 1) {
          that.setData({
            visible: true,
            now_goodsName: now_product.goodsName
          })
        } else if (res.tapIndex == 2) {
          if (item.goodsIcon == "") {
            wx.showToast({
              title: '未上传产品图',
              icon: "none"
            })
          } else {
            wx.previewImage({
              current: item.goodsIcon, // 当前显示图片的http链接
              urls: [item.goodsIcon] // 需要预览的图片http链接列表
            })
          }
        } else if (res.tapIndex == 3) {
          that.handleEditGoods();
        } else if (res.tapIndex == 4) {
          that.handleDelGoods();
        } else if (res.tapIndex == 5) {}
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //已修改
  handleEditGoods: function(e) {
    var that = this
    var item = now_product;
    wx.setStorageSync('editGoods', item)
    wx.navigateTo({
      url: '/pages/goods/goods-edit/goods-edit',
    })
  },
  //已修改
  handleDelGoods: function() {
    var that = this
    var item = now_product;
    console.log(now_product);
    var id = now_product.goodsId
    wx.showModal({
      title: '提示',
      content: '是否删除【' + item.goodsName + '】产品',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });
          var BillsTemp = Bmob.Object.extend("BillsTemp");
          var queryBillsTemp = new Bmob.Query(BillsTemp);
          queryBillsTemp.equalTo("goodsId", id);
          queryBillsTemp.limit(1000)
          queryBillsTemp.find({
            success: function(results) {
              console.log("共查询到 " + results.length + " 条记录");
              var objects = new Array()
              // 批量删除
              Bmob.Object.destroyAll(results).then(function() {
                  console.log('删除BillsTemp成功')
                },
                function(error) {
                  console.log('删除BillsTemp失败')
                });
            },
            error: function(error) {
              console.log("查询失败: " + error.code + " " + error.message);
            }
          });
          var Bills = Bmob.Object.extend("Bills");
          var queryBills = new Bmob.Query(Bills);
          queryBills.equalTo("goodsId", id);
          queryBills.limit(1000)
          queryBills.find({
            success: function(results) {
              console.log("共查询到 " + results.length + " 条记录");
              var objects = new Array()
              // 批量删除
              Bmob.Object.destroyAll(results).then(function() {
                  var Goods = Bmob.Object.extend("Goods");
                  var goods = new Bmob.Query(Goods);
                  goods.get(id, {
                    success: function(result) {
                      result.destroy({
                        success: function(res) {
                          wx.hideLoading();
                          wx.showToast({
                            title: '删除成功',
                            icon: 'success'
                          })
                          that.onLoad();
                        },
                        error: function(result, error) {
                          console.log(error);
                        }
                      })
                    },
                    error: function(result, error) {
                      console.log(error);
                      wx.showToast({
                        title: '删除失败',
                        icon: 'none'
                      })
                    }
                  })
                },
                function(error) {
                  // 异常处理
                });
            },
            error: function(error) {
              console.log("查询失败: " + error.code + " " + error.message);
            }
          });

        }
      }
    })
  },
  loadGoods: function (type, content, class_id) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    });
    that.setData({ spinShow: false });
    // var l = e.Object.extend("Goods"),
    //   d = new e.Query(l);
    // d.equalTo("userId", a),
    var Goods = Bmob.Object.extend("Goods");
    var query = new Bmob.Query(Goods);
    query.equalTo("userId", userid);
    //
     1 == t ? d.equalTo("stocktype", 1) : 0 == t && d.equalTo("stocktype", 0),
      "0" == r && d.equalTo("nousetime", {
        $lte: {
          __type: "Date",
          iso: o.getDay(0) + " 00:00:00"
        }
      });
      //
      if (content != null) {query.equalTo("goodsName", { "$regex": "" + content + ".*" })};
      query.limit(that.data.limitPage);
      query.skip(that.data.limitPage * (that.data.page - 1)),
       query.descending("goodsName"), 
       query.include("userId"), 
       query.include("goodsClass"), 
       query.include("stocks"),
       query.include("second_class"),
       query.find({
       success: function (res) {
         that.setData({ length: res.length });
         wx.hideLoading();
         if (res.length == 0) {
           that.setData({ contentEmpty: true })
         } else {
           that.setData({ contentEmpty: false })
         } 
       }
      });         
            var tempGoodsArr = new Array();
            for (var i = 0; i < res.length; i++) {
              var tempGoods = {}
              tempGoods.userid = userid || '';
              tempGoods.nickName = res[i].userId.nickName || '';
              tempGoods.userName = res[i].userId.username || '';
              tempGoods.avatarUrl = res[i].userId.avatarUrl || '';
              tempGoods.goodsId = res[i].id || '';
              tempGoods.goodsName = res[i].goodsName || '';
              tempGoods.goodsIcon = res[i].goodsIcon || '';
              tempGoods.regNumber = res[i].regNumber || '';
              tempGoods.producer = res[i].producer || '';
              tempGoods.productCode = res[i].productCode || '';
              tempGoods.packageContent = res[i].packageContent || '';
              tempGoods.packingUnit = res[i].packingUnit || '';
              tempGoods.reserve = res[i].reserve || 0;
              tempGoods.costPrice = res[i].costPrice || 0;
              tempGoods.retailPrice = res[i].retailPrice || 0;
              tempGoods.class_text = res[i].class_user || res[i].second_class;
              tempGoods.modify_retailPrice = res[i].retailPrice || 0;
              tempGoods.modify_retailcostPrice = res[i].costPrice || 0;
              tempGoods.product_info = res[i].product_info || "",
                tempGoods.bad_num = res[i].bad_num || 0,
                tempGoods.warning_num = res[i].warning_num || 0,
                tempGoods.stocks = res[i].stocks || "",
                tempGoods.producttime = res[i].producttime || "",
                tempGoods.nousetime = res[i].nousetime || "",
                tempGoodsArr.push(tempGoods);
            }
            that.handleData(tempGoodsArr);
          }
        }
      });
  },
  handleData: function(e) {
    this.setData({
      goods: e
    });
  },
  // loadMore: function() {
  //   var that = this;
  //   if (that.data.length < that.data.limitPage) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '到底啦',
  //     })
  //   } else {
  //     that.setData({
  //       limitPage: that.data.limitPage,
  //       page: that.data.page + 1
  //     }), that.loadGoods(type, null, select_id)
  // },
  //滚动加载更多
  loadMore: function() {
    var that = this;
    if (that.data.length < that.data.limitPage) {
      wx.showToast({
        icon: 'none',
        title: '到底啦',
      })
    } else {
      that.setData({
        limitPage: that.data.limitPage + that.data.limitPage,
      })
      that.loadGoods(type, null, select_id);
    }
  },
  //已修改
  handleResetData: function() {
    this.setData({
      currentPage: 0,
      limitPage: 50,
      page: 1,
      goods: [],
      isEnd: false,
      isEmpty: false,
      inputVal: "",
      inputShowed: false,
      spinShow: false,
      current: "1",
      selectd_stock: "库存",
      stock: ["库存充足", "库存不足"],
      time: ["已失效", "未失效"],
      classes: ["创建时间", "库存量"],
      selectd_class: "类别",
      selectd_order: "排序"
    });
  },
  //已修改handleRefresh
  handleRefresh: function() {
    this.handleResetData(), this.loadGoods(null, null, null);
  },
  //已修改
  onLoad: function(options) {
    userid = wx.getStorageSync("userid");
    that = this;
    this.handleRefresh();
  },
  onReady: function() {},
  //已修改
  onShow: function() {
    var is_add = wx.getStorageSync("is_add");
    if (is_add) {
      this.handleRefresh();
      wx.setStorageSync("is_add", false);
    };
    wx.getStorage({
      key: "stock",
      success: function(e) {
        console.log("getStorage stock:" + e.data.stock_name)
        type = e.data, that.setData({
          selectd_stockposition: e.data.stock_name
        }), that.loadGoods(type, null, select_id);
      }
    });
    wx.getStorage({
      key: "class",
      success: function(e) {
        console.log("getStorage stock11:" + e.data.classtype)
        console.log(e), class_array = e.data.classtype, that.setData({
          selectd_class: e.data.class_text
        }), that.loadGoods(type, null, e.data.objectId);
      }
    });
  },
  onHide: function() {
    wx.removeStorageSync("class"), h = null;
  },
  onUnload: function() {
    i = null, l = null, u = null, h = null, wx.removeStorageSync("stock"), wx.removeStorageSync("class");
  },
  //已修改
  handleClose: function() {
    that.setData({
      visible: false
    });
  },
  //已修改
  get_badnum: function(e) {
    bad_num = e.detail.detail.value;
  },
  //已修改
  get_beizhu: function(e) {
    beizhu_text = e.detail.detail.value;
  },
  //已修改
  handleadd_badnum: function() {
    const product_id = now_product.goodsId;
    const last_bad_num = Number(now_product.bad_num);
    const pointer = Bmob_new.Pointer('_User');
    const poiID = pointer.set(userid);
    const pointer1 = Bmob_new.Pointer('Goods');
    const poiID1 = pointer1.set(product_id);
    const now_bad_num = last_bad_num + Number(bad_num);
    if (bad_num <= 0) {
      wx.showToast({
        title: '货损数量不能为0',
        icon: "none"
      })
    } else {
      const query = Bmob_new.Query('bad_goods');
      query.set("bad_num", bad_num);
      query.set("beizhu_text", beizhu_text);
      query.set("operater", poiID);
      query.set("goods", poiID1);
      query.save().then(res => {
        const query = Bmob_new.Query('Goods');
        query.set('id', product_id) //需要修改的objectId
        query.set('bad_num', now_bad_num)
        query.save().then(res => {
          that.setData({
            visible: false
          });
          that.onLoad();
          wx.showToast({
            title: '记录成功',
          });
        })
      })
    }
  }
})