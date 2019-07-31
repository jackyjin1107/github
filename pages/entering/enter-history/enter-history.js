// pages/delivery/delivery-history/delivery-history.js
var Bmob = require('../../../utils/bmob.js');
var Bmob_new = require('../../../utils/bmob_new.js');
var that;
wx.getStorageSync("userid");
Page({

  /*** 页面的初始数据*/
  data: {
    beizhu_text: "",
    goods: "",
    all_money: 0,
    real_money: 0,
  },
  choose_producer: function() {
    wx.navigateTo({
      url: "../../second/choose_producer/choose_producer"
    });
  },
  //输入实际得到的钱款
  getreal_money: function(e) {
    var real_money = e.detail.detail.value;
    that.setData({
      real_money: real_money
    });
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    that = this;
    wx.removeStorageSync("producer");
    var operate_goods = wx.getStorageSync("operate_goods");
    var all_money = 0;
    var real_money = 0;
    for (var i = 0; i < operate_goods.length; i++) {
      console.log(operate_goods.length);
      all_money += operate_goods[i].total_money;
    }
    that.setData({
      goods: operate_goods,
      all_money: all_money,
      real_money: all_money
    });
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function() {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function() {
    // var producer = wx.getStorageSync("producer");
    // if (producer != null) {
    //   that.setData({
    //     producer: producer
    //   });
    //   console.log(producer)
    // }
    var producer = wx.getStorageSync("producer");
    if (producer != null) {
      that.setData({
        producer: producer
      });
    }
  },
  input_beizhu: function(e) {
    var input_beizhu = e.detail.value;
    that.setData({
      beizhu_text: input_beizhu
    });
  },

  confrim_delivery: function(e) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();

    var formId = e.detail.formId;

    that.setData({
      button: true
    });
    var operation_ids = [];
    var Goods = Bmob.Object.extend("Goods");
    var Bills = Bmob.Object.extend("Bills");
    var objects = new Array();
    var billsObj = new Array();
    for (var i = 0; i < that.data.goods.length; i++) {
      if (that.data.goods[i].num > 0) {
        var num = Number(that.data.goods[i].reserve + that.data.goods[i].num);
        console.log(num);
        var tempGoods = new Goods();
        tempGoods.set('objectId', that.data.goods[i].objectId);
        tempGoods.set('reserve', num)
        tempGoods.set("stocktype", num > that.data.goods[i].warning_num ? 1 : 0),
          objects.push(tempGoods)
        //单据
        var tempBills = new Bills();
        var user = new Bmob.User();
        user.id = wx.getStorageSync('userid');
        tempBills.set('goodsName', that.data.goods[i].goodsName);
        tempBills.set('retailPrice', Number(that.data.goods[i].modify_retailcostPrice));
        tempBills.set('num', that.data.goods[i].num)
        tempBills.set('total_money', Number(that.data.goods[i].total_money));
        tempBills.set('goodsId', tempGoods);
        console.log(tempGoods);
        tempBills.set('userId', user);
        tempBills.set('type', 1);
        billsObj.push(tempBills)
      }
    }
    Bmob.Object.saveAll(objects).then(function(objects) {
        // 批量更新成功
        console.log("批量更新成功", objects);
        console.log("objects[0].id" + objects[0].id);
        //插入单据
        Bmob.Object.saveAll(billsObj).then(function(res) {
            //console.log("批量新增单据成功", res);
            for (var i = 0; i < res.length; i++) {
              operation_ids.push(res[i].id);
              if (i == (res.length - 1)) {
                //console.log("批量新增单据成功", res);
                var currentUser = Bmob.User.current();
                const relation = Bmob_new.Relation('Bills'); // 需要关联的表
                const relID = relation.add(operation_ids);

                const pointer = Bmob_new.Pointer('_User')
                const poiID = pointer.set(currentUser.id);
                const query = Bmob_new.Query('order_opreations');
                query.set("relations", relID);
                query.set("beizhu", that.data.beizhu_text);
                query.set("type", 1);
                query.set("opreater", poiID);
                query.set("master", poiID);
                query.set("all_money", Number(that.data.all_money));
                query.set("real_money", Number(that.data.real_money)),
                query.set('goodsName', that.data.goods[0].goodsName);
                query.set("debt", Number(that.data.all_money) - Number(that.data.real_money));
                if (!that.data.producers || that.data.producers.objectId != null) {
                  const producers = Bmob_new.Pointer('producers');
                  // const producersID = producers.set(that.data.producers.objectId);
                  const producersID = objects[0].id;
                  console.log(objects[0].id);
                  query.set("producers", producersID);
                  // if (that.data.custom.objectId != null) {
                  //   const custom = Bmob_new.Pointer('customs');
                  //   const customID = custom.set(that.data.custom.objectId);
                  //   query.set("custom", customID);
                  console.log(that.data.all_money);
                  //如果客户有欠款
                  if ((that.data.all_money - Number(that.data.real_money)) > 0) {
                    const query = Bmob_new.Query('producers');
                    query.get(that.data.producers.objectId).then(res => {
                      var debt = (res.debt == null) ? 0 : res.debt;
                      debt = debt + (that.data.all_money - Number(that.data.real_money));
                      console.log(debt);
                      const query = Bmob_new.Query('producers');
                      query.get(that.data.producers.objectId).then(res => {
                        res.set('debt', debt)
                        res.save()
                        // const query = Bmob_new.Query('customs');
                        // query.get(that.data.custom.objectId).then(res => {
                        //   var debt = (res.debt == null) ? 0 : res.debt;
                        //   debt = debt + (that.data.all_money - Number(that.data.real_money));
                        //   console.log(debt);
                        //   const query = Bmob_new.Query('customs');
                        //   query.get(that.data.custom.objectId).then(res => {
                        //     res.set('debt', debt)
                        //     res.save()
                      })
                    })
                  }
                }
                query.set("all_money", that.data.all_money);
                query.save().then(res => {
                  console.log("添加操作历史记录成功", res);
                  wx.showToast({
                    title: '产品入库成功',
                    icon: 'success',
                    success: function() {
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 2
                        })
                      }, 1000)
                    }
                  })
                })
              }
            }
          },
          function(error) {
            // 批量新增异常处理
            console.log("异常处理");
          });
      },
      function(error) {
        // 批量更新异常处理
        console.log(error);
      });
  }
})