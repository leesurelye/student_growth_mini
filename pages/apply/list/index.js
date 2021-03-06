const app = getApp();
import { applyCategory } from '../../../store/index.js'
import request from '../../../request/index.js'
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    contentData: null,
    fuzzyList: null,
    category: applyCategory,
    sort: '研究创新'
  },
  //获取申请列表
  getApplyList(sort) {
    wx.showLoading()
    request.get('project/applyList', { sort })
      .then(res => {
        wx.hideLoading()
        this.setData({ contentData: res.data })
      }).catch(err=>{
        wx.hideLoading()
        wx.showToast({title:'获取数据失败:'+err.data.sysError,icon:'none',duration:3000})
      })

  },

  onLoad: function (options) {
    this.getApplyList(this.data.sort);
  },

  onReady: function () {
    let that = this;
    wx.getSystemInfo({
      success: function success(res) {
        that.setData({ scrollHeight: (res.windowHeight - 100) + "px" });
      }
    })
  },
  searchProject(e) {
    let value = e.detail.value
    if (e.detail.value == "") {
      this.setData({ fuzzyList: null })
    } else {
      wx.showLoading()
      request.get('project/fuzzyQuery', { keyword: value })
        .then(res => {
          wx.hideLoading()
          this.setData({
            fuzzyList: res.list
          })
        }).catch(err=>{
          wx.hideLoading() 
          this.setData({
            fuzzyList: []
          })
        })
    }
  },
  //申请表单
  chooseItem(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/apply/detail/index?menuId=' 
      + item.menuId + '&applyId=' 
      + item.id + '&name=' + item.name
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    const item = e.currentTarget.dataset.item
    this.getApplyList(item.name)
    this.setData({
      TabCur: item.id
    })
  }
});
