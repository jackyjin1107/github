const Bmob_new = require('../../../utils/bmob_new.js');
const Bmob = require('../../../utils/bmob.js');
var that;
var userid;
var class_text;
var get_id;
var edit_class_text;

Page({
  data: {
    type: true
  },
  goto_goods: function(e) {
    var item = e.currentTarget.dataset.item;
    var classtype = e.currentTarget.dataset.classtype;
    item.classtype = classtype;
    wx.setStorageSync("class", item);
    wx.navigateBack({
      delta: 1
    });
    console.log(item),
      console.log(classtype)
  },

  selected_this_one: function(e) {
    get_id = e.currentTarget.dataset.id,
      that.setData({
        selected_id: e.currentTarget.dataset.id
      }),
      console.log("selected_id" + e.currentTarget.dataset.id);
    that.query_second_class();
  },

  add_secclass: function(e) {
    class_text = null,
      that.setData({
        one_click: true
      });
  },


  show_operation: function(e) {
    get_id = e.currentTarget.dataset.id;
    edit_class_text = e.currentTarget.dataset.dbname;
    var value = e.currentTarget.dataset.value;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.setData({
            edit_visible: true,
            get_class_text: value
          });
        } else {
          that.delete_class_text();
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  //删除此类别
  delete_class_text: function() {
    wx.showModal({
      title: '提示',
      content: '是否删除此分类',
      success(res) {
        if (res.confirm) {
          const query = Bmob_new.Query('class_user');
          query.destroy(get_id).then(res => {
            console.log(res)
            wx.showToast({
              title: '删除成功'
            });
            that.getclass_list();
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })

  },

  //输入产品类别事件
  getclass_text: function(e) {
    class_text = e.detail.detail.value;
  },

  //修改输入框输入
  editclass_text: function(e) {
    edit_class_text = e.detail.detail.value;
  },

  //获得二级菜单
  getclass_secondtext: function(e) {
    getclass_secondtext = e.detail.detail.value;
  },

  //second_class和class_user建立关系
  getclass_text_confrim_second: function() {
    that.handleClose();
    const pointer = Bmob_new.Pointer('class_user')
    const poiID = pointer.set(userid);
    const query = Bmob_new.Query('second_class');
    query.set("parent", poiID)
    query.set("class_text", class_text);
    query.save().then(res => {
      console.log(res);
      const relation = Bmob_new.relation("second_class");
      const relID = relation.add([poiID.objectId]);
      const query = Bmob.Query('class_user');
      query.get('userid').then(res => {
        res.set('second', relID);
        res.save();
        that.query_second_class();
      });
    }).catch(err => {
      console.log(err)
    });
  },

  //确定修改
  getclass_text_edit: function() {
    const query = Bmob_new.Query('class_user');
    query.set('id', get_id); //需要修改的objectId
    query.set('class_text', edit_class_text);
    query.save().then(res => {
      console.log(res);
      that.setData({
        edit_visible: false
      });
      wx.showToast({
        title: '修改成功'
      });
      that.getclass_list();
    }).catch(err => {
      console.log(err)
    })
  },

  //处理modal的显示与消失
  add_class: function() {
    that.setData({
      visible: true
    });
  },

  //处理
  handleClose: function() {
    that.setData({
      visible: false,
      edit_visible: false,
      one_click: false
    });
  },

  //已修改
  getclass_text_confrim: function() {
    if (class_text == null || class_text == '') {
      wx.showToast({
        icon: "none",
        title: '请输入类别',
      })
    } else {
      wx.showLoading({
        title: '添加中...'
      });
      const pointer = Bmob_new.Pointer('_User')
      const poiID = pointer.set(userid);
      const query = Bmob_new.Query('class_user');
      query.set("parent", poiID)
      query.set("class_text", class_text);
      query.save().then(res => {
        console.log(res);
        that.setData({
          visible: false
        });
        that.getclass_list();
        wx.hideLoading();
      }).catch(err => {
        console.log(err)
      })
    }

  },

  //已修改
  getclass_list: function() {
    wx.showLoading({
      title: '加载中...'
    })
    const query = Bmob_new.Query("class_user");
    query.equalTo("parent", "==", userid);
    query.find().then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.length == 0) {
        that.setData({
          isEmpty: true
        });
      } else {
        get_id = res[0].objectId,
          console.log("userid change selected_id" + res[0].objectId);
        that.setData({
          class_text: res,
          isEmpty: false,
          selected_id: res[0].objectId
        });
        wx.setStorageSync("class", res);
        // console.log("selected_id" + selected_id)
        that.query_second_class(), wx.hideLoading();
      }
    });
  },

  //已修改
  query_second_class: function() {
    wx.showLoading({
      title: "加载中..."
    });
    const query = Bmob_new.Query("class_user");
    query.field("second", get_id);
    console.log("second is " + get_id);
    query.relation("second_class").then(res => {
      wx.hideLoading(), that.setData({
        second_class: res.results
      });
    });
  },

  onLoad: function(e) {
    that = this, "select" == e.type && that.setData({
        type: false
      }), userid = wx.getStorageSync("userid"),
      that.getclass_list();
  },
  //    onLoad: function (options) {
  //   that = this;
  //   var currentUser = Bmob.User.current();
  //   userid = currentUser.id;
  //   console.log(currentUser.id);
  //   that.getclass_list();
  // },
});