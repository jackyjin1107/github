const Bmob = require('../../utils/bmob_new.js');
var that;
var userid;
Page({
  data: {
    optionsLists: [{
        name: "产品入库",
        icon: "../../images/index/entering.png",
        url: "/pages/common/goods-select/goods-select?type=entering"
      }, {
        name: "产品出库",
        icon: "../../images/index/delivery.png",
        url: "/pages/common/goods-select/goods-select?type=delivery"
      }, {
        name: "退货入库",
        icon: "../../images/index/return_goods.png",
        url: "/pages/common/goods-select/goods-select?type=returing"
      }, {
        name: "库存盘点",
        icon: "../../images/index/stocking.png",
        url: "/pages/common/goods-select/goods-select?type=counting"
      }, {
        name: "产品管理",
        icon: "../../images/index/goods.png",
        url: "/pages/goods/goods"
      }, {
        name: "仓库管理",
        icon: "../../images/index/canvas.png",
        url: "/pages/second/stocks/stocks"
      }, {
        name: "客户管理",
        icon: "../../images/index/customs.png",
        url: "/pages/second/custom/custom"
      }, {
        name: "供货商管理",
        icon: "../../images/index/mine.png",
        url: "/pages/second/producer/producer"
      }, {
        name: "操作记录",
        icon: "../../images/index/order_history.png",
        url: "/pages/order_history/order_history"
      }, {
        name: "盈收记录",
        icon: "../../images/index/stock.png",
        url: "/pages/detail_finance/detail_finance"
      }
      // {
      //   name: "协同管理",
      //   icon: "../../images/index/togeter.png",
      //   url: "/pages/friends/friends"
      // },  {
      //   name: "财务报表",
      //   icon: "../../images/index/finance.png",
      //   url: "/pages/finance/finance"
      // }
    ]
  },
  gettoday_detail: function() {
    var get_reserve = 0;
    var out_reserve = 0;
    var get_reserve_real_money = 0;
    var out_reserve_real_money = 0;
    var get_reserve_num = 0;
    var out_reserve_num = 0;

    const query = Bmob.Query("Bills");
    query.equalTo("userId", "==", wx.getStorageSync("userid"));
    query.equalTo("createdAt", ">=", that.getDay(0));
    query.equalTo("createdAt", "<=", that.getDay(1));

    query.include("goodsId");
    query.find().then(res => {
      for (var i = 0; i < res.length; i++) {
        if (res[i].type == 1) {
          get_reserve = get_reserve + res[i].num;
          get_reserve_real_money = get_reserve_real_money + res[i].num * res[i].goodsId.retailPrice;
          get_reserve_num = get_reserve_num + res[i].total_money;
        } else if (res[i].type == -1) {
          out_reserve = out_reserve + res[i].num;
          out_reserve_real_money = out_reserve_real_money + res[i].num * res[i].goodsId.costPrice;
          out_reserve_num = out_reserve_num + res[i].total_money;
        }
      }

      that.setData({
        get_reserve: get_reserve,
        out_reserve: out_reserve,
        get_reserve_real_money: get_reserve_real_money,
        out_reserve_real_money: out_reserve_real_money,
        get_reserve_num: get_reserve_num.toFixed(2),
        out_reserve_num: out_reserve_num,
        get_reserve_get_num: (get_reserve_real_money - get_reserve_num).toFixed(2),
        out_reserve_get_num: out_reserve_num - out_reserve_real_money,
      });
    });
  },
  loadallGoods:function() {
    var total_reserve = 0;
    var total_money = 0;
    const query = Bmob.Query("Goods");
    query.equalTo("userId", "==", wx.getStorageSync("userid"));
    query.limit(1000);
    query.find().then(res => {
      for (var i = 0; i < res.length; i++) {
        // console.log(res);
        total_reserve = total_reserve + res[i].reserve;
        // console.log(total_reserve);
        // console.log(res[i].reserve);
        total_money = total_money + res[i].reserve * res[i].costPrice;
        // console.log(total_money);
      }
      that.setData({
        total_reserve: total_reserve,
        total_money: total_money,
        total_products: res.length,
        spinShow: true
      });

      that.gettoday_detail();
    });
  },
  scan_code: function() {
    wx.showActionSheet({
      itemList: ["扫码出库", "扫码入库", "扫码盘点", "扫码添加产品", "查看详情"],
      success: function(res) {
        that.scan(res.tapIndex);
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  },
  scan: function(type) {
    wx.scanCode({
      success: function(res) {
        var array = res.result.split("-");
        console.log(array);
        if (type == 0) {
          wx.navigateTo({
            url: "../delivery/delivery?id=" + array[0] + "&type=" + array[1],
            
          })
          console.log("array="+ array[0]);
        } else if (type == 1) {
          wx.navigateTo({
            url: "../entering/entering?id=" + array[0] + "&type=" + array[1],
          })
          console.log(url);          
        } else if (type == 2) {
          wx.navigateTo({
            url: "../counting/counting?id=" + array[0] + "&type=" + array[1],
          })
        } else if (type == 3) {
          wx.navigateTo({
            url: "../goods/goods-add/goods-add?id=" + array[0],
          })
        } else if (type == 4) {
          wx.navigateTo({
            url: "../common/goods-dtl/goods-dtl?id=" + array[0] + "&type=" + array[1],
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: "未识别到条形码",
          icon: "none"
        })
      }
    })
  },
  getDay: function(day) {
    var that = this;
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = that.handleMonth(tMonth + 1);
    tDate = that.handleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate + " " + "00:00:00";
  },
  handleMonth: function(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  skip: function() {
    wx.navigateTo({
      url: "../mine/upgrade/upgrade"
    });
  },
  getnum_from_bmob: function() {
    const query = Bmob.Query("setting");
    query.equalTo("parent", "==", userid);
    query.find().then(res => {
      if (res.length == 1) {
        wx.setStorageSync("setting", res[0])
      }
    });
  },
  onLoad: function(options) {
    that = this,
      userid = wx.getStorageSync("userid"),
      // wx.setStorageSync("setting", { "num_enough": 0, "num_insufficient": 0, "num_warning": 0 });
      that.getnum_from_bmob();
  },
  onReady: function() {},
  onShow: function() {
    that.gettoday_detail(), that.loadallGoods();
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
});