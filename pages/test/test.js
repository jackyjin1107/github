// pages/test/test.js
var app=getApp();
var pages=getCurrentPages();
// console.log(pages);
var currentpages=pages[pages.length-1];
// console.log(currentpages);
const Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0
  },
  choose_name: function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  add: function() {
    var Diary = Bmob.Object.extend("test");
    var diary = new Diary();
    diary.set("title", "hello");
    diary.set("content", "hello world");
    //添加数据，第一个入口参数是null
    diary.save(null, {
      success: function(result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("日记创建成功, objectId:" + result.id);
      },
      error: function(result, error) {
        // 添加失败
        console.log('创建日记失败');

      }
    });
  },
  search: function() {
    var Diary = Bmob.Object.extend("test");
    var query = new Bmob.Query(Diary);
    // 查询所有数据
    query.find({
      success: function(results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object.get('title'));
          console.log(object.id + ' - ' + object.get('content'))
        }
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  search1: function() {
    var Diary = Bmob.Object.extend("test");
    var query = new Bmob.Query(Diary);
    // 查询所有数据
    query.get("9913fed91f", {
      success: function(results) {
        var title = results.get("title");
        var content = results.get("content");
        console.log(results.get('title'));
        console.log(results.get('content'))
      },

      error: function(object, error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  del: function() {
    var Diary = Bmob.Object.extend("test");
    var query = new Bmob.Query(Diary);
    query.equalTo("title", "bmob");
    query.destroyAll({
      success: function(todos) {
        console.log("更新成功");
      },
      function(error) {
        console.log("更新failure");
      }
    });
  },
  click: function() {
    this.setData({
      count: this.data.count + 1,
    });
     
  },
  customData:{
    name:"weixin"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(app.globalData)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})